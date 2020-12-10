const chrome = require('selenium-webdriver/chrome');
const { Builder, By } = require("selenium-webdriver");

const parse_reason = (rawHTML) => {
    const idx = rawHTML.indexOf('</span>')
    const text = rawHTML.substring(idx + 7)
    const count = text.split('(').length - 1
    let i = text.indexOf('(')
    let reason = text.slice(i + 1, -1)
    if (count > 1) {
        i = reason.indexOf('(')
        reason = reason.substring(i + 1)
    }

    if (text.includes('오후')) return ['AFT OFF', reason]
    else if (text.includes('오전')) return ['MOR OFF', reason]
    else return ['DAY OFF', reason]
}
const crawl = async () => {
    const id = "guseul.heo";
    const pw = "park1234!";
    const driver = new Builder()
        .forBrowser('chrome').setChromeOptions(new chrome.Options())//.headless().excludeSwitches("enableLogging")
        .build();
    const login_url = "https://my.parksystems.com/ekp/view/login/userLogin";
    const main_url = "https://my.parksystems.com/ekp/main/home/homGwMain";
    await driver.get(login_url);
    const id_input = await driver.findElement(By.name("userId"));
    const pwd_input = await driver.findElement(By.name("password"));
    const login_btn = await driver.findElement(By.id("btnLogin"));
    await id_input.sendKeys(id);
    await pwd_input.sendKeys(pw);
    await login_btn.click();
    await driver.get(main_url);
    const result = []

    console.log('click')
    const popup_open_btn = await driver.findElement(By.xpath('//*[@id="ptlAbsent_count"]'))
    popup_open_btn.click();

    const tbody = await driver.findElements(By.css("#atnMainAbsentList_list>tr"));
    for (var i = 0; i < tbody.length; i++) {
        const path = `//*[@id="atnMainAbsentList_list"]/tr[${i + 1}]`;
        const name_ele = await driver.findElement(
            By.xpath(path + "/td[1]/div/span[2]")
        );
        const rank_ele = await driver.findElement(By.xpath(path + "/td[2]/div"));
        const team_ele = await driver.findElement(By.xpath(path + "/td[3]/div"));
        const reason_ele = await driver.findElement(By.xpath(path + "/td[4]"));
        const name = await name_ele.getAttribute("innerHTML");
        const rank = await rank_ele.getAttribute("innerHTML");
        const team = await team_ele.getAttribute("innerHTML");
        const [flag, reason] = parse_reason(
            await reason_ele.getAttribute("innerHTML")
        );
        const row = { name, rank, team, flag, reason }
        result.push(row)
    }
    // driver.close()
    console.log('result', result)


    return result
}

crawl()