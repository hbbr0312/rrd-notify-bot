const moment = require('moment-timezone')
const crawler = require('./crawler.js')
const sender = require('./sender.js')
const parser = require('./parser.js')
const errorReporter = require('./errorReporter.js')

const getNow = () => {
    const now = moment().tz('Asia/Seoul')
    return now
}

const isWeekend = (now) => {
    const day = now.day()
    console.log(now.format('llll'))
    console.log('day:', day)
    return day % 6 == 0
}

const notify = async () => {
    const num_trials = 30
    const now = getNow()
    const today = now.format('YYYY-MM-DD')
    if (isWeekend(now)) {
        console.log('오늘은 휴일입니다.')
        return
    }

    const errorMessages = []
    for (var i = 0; i < num_trials; i++) {
        const [success, psVacationers, errorMessage] = await crawler.crawl()
        if (success) {
            const rrdVacationersInfo = parser.parse(psVacationers)
            sender.sendNotice(today, rrdVacationersInfo)
            console.log(`# of trials: ${i + 1}`)
            return
        } else {
            errorMessages.push(errorMessage)
            console.error(errorMessage)
        }
    }
    // num_trials번 시도에도 실패시 Error 메시지 전송
    const failMessage = errorMessages.join('\n')
    errorReporter.sendErrorMessage(failMessage)
}

exports.notify = notify