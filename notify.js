
// TODO: uri, id, pw 등 env로 빼기
const puppeteer = require('puppeteer')
const id = 'guseul.heo'
const pw = 'park1234!'
const rrd_departments = ['통합운영팀', 'FX전담팀', '분석설계팀', '개발1팀', '개발2팀', '품질개발팀']
const webhookuri = 'https://hooks.slack.com/services/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'
const Slack = require('slack-node')

const slack = new Slack()
slack.setWebhook(webhookuri)

function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

const sendNotice = async (message) => {
    const date = formatDate()
    slack.webhook({
        icon_emoji: ':beach_with_umbrella:',
        username: 'RRD 부재자 알림봇',
        text: `${date} RRD 부재자 명단입니다.`,
        attachments: [
            {
                fallback: "fallback",
                color: "#00FFFF",
                fields: [
                    {
                        title: "부재자",
                        value: message,
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
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
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
    let today_vacationers = []
    if (modalOpenBtn) {
        await modalOpenBtn.click()
        await page.waitForSelector("tbody#atnMainAbsentList_list")
        await page.waitForFunction(selector => document.querySelector(selector).innerText.length > 0,
            {},
            '#atnMainAbsentList_list');
        console.log('wait done')
        today_vacationers = await page.evaluate(() => {
            const tbody = document.getElementById("atnMainAbsentList_list");
            const trs = tbody.getElementsByTagName("tr");
            const vacationers_info = []
            for (var i = 0; i < trs.length; i++) {
                const vacationer_info = []
                const tds = trs[i].getElementsByTagName("td");
                for (var j = 0; j < tds.length; j++) {
                    let info = tds[j].innerText.trim()
                    vacationer_info.push(info)
                }
                vacationers_info.push(vacationer_info)
            }
            return vacationers_info
        });
    }
    browser.close();
    return today_vacationers
}

const filter_rrd = (vacationers) => {
    return vacationers.filter(e => rrd_departments.includes(e[2]))
}

const parse_vacation_type = (content) => {
    if (content.includes('오후')) return '오후 반차'
    else if (content.includes('오전')) return '오전 반차'
    else return '휴가'
}

const convert_to_infomation = (vacationer) => {
    const [name, position, department, vacation_type, delegate] = vacationer
    return `${name} ${position} : ${vacation_type}`
}

const main = async () => {
    const today_vacationers = await crawl()
    const rrd_vacationers = filter_rrd(today_vacationers)
    rrd_vacationers.forEach(element => {
        element[3] = parse_vacation_type(element[3])
    });
    const rrd_vacatiners_info = rrd_vacationers.map(e => convert_to_infomation(e)).join('\n')
    sendNotice(rrd_vacatiners_info)
}

main()