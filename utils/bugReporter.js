const debugReportURI = process.env.WEBHOOK_URI_FOR_DEBUG
const Slack = require('slack-node')
const slack = new Slack()
slack.setWebhook(debugReportURI)

const sendErrorMessage = async (message) => {
    slack.webhook({
        icon_emoji: ':beach_with_umbrella:',
        username: 'RRD 부재자 알림봇 Error Report',
        text: `에러가 발생하였습니다.`,
        attachments: [
            {
                fallback: "fallback",
                color: "#00FFFF",
                fields: [
                    {
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

exports.sendErrorMessage = sendErrorMessage