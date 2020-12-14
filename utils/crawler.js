const puppeteer = require('puppeteer')

// const id = 'guseul.heo' // process.env.USERNAME
// const pw = 'park1234!' //process.env.PASSWORD
// const groupwareURI = 'https://my.parksystems.com/ekp/main/home/homGwMain' //process.env.GROUPWARE_URI

const id = process.env.USERNAME
const pw = process.env.PASSWORD
const groupwareURI = process.env.GROUPWARE_URI

console.log(id)

// TODO: crawling 실패 메시지 추가 (실제로 부재자없음과 크롤링 실패 구분 필요)
// 만약 크롤링 실패할경우 error 알림용 private channel로 에러 메시지? 전송
// 만약 크롤링 성공하면 rrd-notice 채널에 알림 메시지 전송 
const crawl = async () => {
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    try {
        console.log('start to crawl')
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(40000);
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
            return ['Login failed', null]
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
                return [null, psVacationers]
            });
        } else {
            return ['Absent button does not exists', null]
        }
        return todayPsVacationers
    } catch (err) {
        console.error(err.message);
        return [err.message, null]
    } finally {
        await browser.close();
    }
}

exports.crawl = crawl