const crawler = require('./crawler.js')
const sender = require('./sender.js')
const parser = require('./parser.js')
const bugReporter = require('./bugReporter.js')

const isWeekend = () => {
    const day = new Date().getDay()
    return day % 6 == 0
}

const notify = async () => {
    console.log('day:', new Date().getDay())
    if (isWeekend()) {
        console.log('오늘은 휴일입니다.')
        return
    }
    const [errorMessage, psVacationers] = await crawler.crawl()
    if (errorMessage) {
        bugReporter.sendErrorMessage(errorMessage)
    } else {
        const rrdVacationersInfo = parser.parse(psVacationers)
        sender.sendNotice(rrdVacationersInfo)
    }
}

exports.notify = notify