const crawler = require('./crawler.js')
const sender = require('./sender.js')
const parser = require('./parser.js')

const isWeekend = () => {
    const day = new Date().getDay()
    return day % 6 == 0
}

const notify = async () => {
    if (isWeekend()) return
    const today_vacationers = await crawler.crawl()
    const rrd_vacatiners_info = parser.parse(today_vacationers)
    sender.sendNotice(rrd_vacatiners_info)
}

exports.notify = notify