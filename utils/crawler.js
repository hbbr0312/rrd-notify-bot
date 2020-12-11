const puppeteer = require('puppeteer')
const id = process.env.USERNAME
const pw = process.env.PASSWORD
const groupwareURI = process.env.GROUPWARE_URI

const crawl = async () => {
    const browser = await puppeteer.launch({
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    const page = await browser.newPage();
    await page.goto(groupwareURI, { waitUntil: 'load' });
    await page.evaluate((text) => { (document.getElementById('userId')).value = text; }, id);
    await page.type('[name=password]', pw);
    await page.click('#btnLogin')
    const start = new Date().getTime();
    try {
        await page.waitForNavigation()
    } catch (error) {
        console.log(error)
        browser.close();
        return
    }
    const end = new Date().getTime();
    console.log(`${end - start} seconds passed`)
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
            return psVacationers
        });
    }
    browser.close();
    return todayPsVacationers
}

exports.crawl = crawl