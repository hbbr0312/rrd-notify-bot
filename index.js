const express = require('express')
const puppeteer = require('puppeteer')
const Slack = require('slack-node')
const app = express()
const PORT = process.env.PORT
const id = 'guseul.heo'
const pw = 'park1234!'
const webhookuri = 'https://hooks.slack.com/services/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'

const slack = new Slack()
slack.setWebhook(webhookuri)
const sendNotice = async (message) => {
    slack.webhook({
        icon_emoji: ':beach_with_umbrella:',
        username: 'RRD 휴가자 알림봇',
        text: message,
        attachments: [
            {
                fallback: "fallback",
                pretext: "pretext",
                color: "#00FFFF",
                fields: [
                    {
                        title: "알림",
                        value: "해당링크를 클릭하여 검색해 보세요.",
                        short: false
                    }
                ]
            }
        ]
    }, function (err, response) {
        console.log(response);
    });
}

const crawl = async () => {
    const browser = await puppeteer.launch({
        'args': [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
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
            return arr
        });
        browser.close();
        return links
    } else {
        browser.close();
        return []
    }
}

app.get("/", async (req, res) => {
    const vacationers = await crawl()
    sendNotice(vacationers)
    res.send({ vacationers });
});

app.listen(PORT);