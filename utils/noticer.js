const crawler = require('./crawler.js')
const sender = require('./sender.js')
const parser = require('./parser.js')
const errorReporter = require('./errorReporter.js')

const isWeekend = () => {
    const day = new Date().getDay()
    return day % 6 == 0
}

const notify = async () => {
    const num_trials = 30
    console.log('day:', new Date().getDay())
    if (isWeekend()) {
        console.log('오늘은 휴일입니다.')
        return
    }

    const errorMessages = []
    for (var i = 0; i < num_trials; i++) {
        const [success, psVacationers, errorMessage] = await crawler.crawl()
        if (success) {
            const rrdVacationersInfo = parser.parse(psVacationers)
            sender.sendNotice(rrdVacationersInfo)
            return
        } else {
            errorMessages.push(errorMessage)
        }
    }
    // num_trials번 시도에도 실패시 Error 메시지 전송
    const failMessage = errorMessages.join('\n')
    errorReporter.sendErrorMessage(failMessage)
}

exports.notify = notify