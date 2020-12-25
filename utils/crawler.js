const puppeteer = require('puppeteer')
const id = process.env.USERNAME
const pw = process.env.PASSWORD
const groupwareURI = process.env.GROUPWARE_URI

const crawl = async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    try {
        console.log('start to crawl')
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(60000);
        await page.emulateTimezone('Asia/Seoul');
        await page.goto(groupwareURI, { waitUntil: 'load' });
        await page.evaluate((text) => { (document.getElementById('userId')).value = text; }, id);
        await page.type('[name=password]', pw);
        await page.click('#btnLogin')
        console.log('clicked login button')
        const start = new Date().getTime();
        try {
            await page.waitForNavigation()
        } catch (error) {
            console.log(error)
            browser.close();
            return [false, null, 'Login failed']
        }
        const end = new Date().getTime();
        console.log(`${(end - start) / 1000} seconds passed`)
        const [modalOpenBtn] = await page.$x('//*[@id="ptlAbsent_count"]')
        let todayPsVacationers = []
        if (modalOpenBtn) {
            await modalOpenBtn.click()
            await page.waitForSelector("tbody#atnMainAbsentList_list")
            await page.waitForFunction(selector => document.querySelector(selector).innerText.length > 0,
                {},
                '#atnMainAbsentList_list');
            console.log('wait done')
            todayPsVacationers = await page.evaluate(() => {
                const tbody = document.getElementById("atnMainAbsentList_list");
                const trs = tbody.getElementsByTagName("tr");
                const psVacationers = []
                for (var i = 0; i < trs.length; i++) {
                    const vacationer = []
                    const tds = trs[i].getElementsByTagName("td");
                    for (var j = 0; j < tds.length; j++) {
                        let info = tds[j].innerText.trim()
                        vacationer.push(info)
                    }
                    psVacationers.push(vacationer)
                }
                return [true, psVacationers, null]
            });
        } else {
            return [false, null, 'Absent button does not exists']
        }
        return todayPsVacationers
    } catch (err) {
        console.error(err.message);
        return [false, null, err.message]
    } finally {
        await browser.close();
    }
}

exports.crawl = crawl