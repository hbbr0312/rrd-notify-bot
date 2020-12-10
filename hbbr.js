const puppeteer = require('puppeteer')

const id = 'guseul.heo'
const pw = 'park1234!'


const crawl = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto('https://my.parksystems.com/ekp/view/login/userLogin', { waitUntil: 'load' });
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
    if (modalOpenBtn) {
        await modalOpenBtn.click()
        await page.waitForSelector("tbody#atnMainAbsentList_list")
        console.log('wait done')
        const links = await page.evaluate(() => {
            const arr = document.getElementById('atnMainAbsentList_list').innerText
            console.log(arr)
            return arr
        });
        console.log('"', links, '"')
        if (!links) console.log('no data')
    } else {
        console.log('no button')
    }
    // browser.close();

}


crawl()