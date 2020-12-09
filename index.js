const express = require('express')
const puppeteer = require('puppeteer')
const app = express()
const PORT = process.env.PORT
const username = process.env.USERNAME
const password = process.env.PASSWORD

async function main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 720 });
    await page.goto('https://my.parksystems.com/ekp/main/home/homGwMain', { waitUntil: 'networkidle0' }); // wait until page load
    await page.type('[name=userId]', username);
    await page.type('[name=password]', password);
    // click and wait for navigation
    await Promise.all([
        page.click('#btnLogin'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    const text = await page.evaluate(() => {
        // $x() is not a JS standard -
        // this is only sugar syntax in chrome devtools
        // use document.evaluate()
        const featureArticle = document
            .evaluate(
                '//*[@id="ptlAbsent_count"]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            )
            .singleNodeValue;

        return featureArticle.textContent;
    });
    return text
}

app.get("/", (req, res) => {
    const text = main()
    res.send({ hello: text });
});

app.listen(PORT);