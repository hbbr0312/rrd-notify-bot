const crawler = require('./crawler.js')
const sender = require('./sender.js')
const parser = require('./parser.js')

const isWeekend = () => {
    const day = new Date().getDay()
    return day % 6 == 0
}

const notify = async () => {
    if (isWeekend()) return
    const psVacationers = await crawler.crawl()
    const rrdVacationersInfo = parser.parse(psVacationers)
    sender.sendNotice(rrdVacationersInfo)
}

exports.notify = notify