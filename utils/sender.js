const webhookURI = process.env.WEBHOOK_URI
const Slack = require('slack-node')
const slack = new Slack()
slack.setWebhook(webhookURI)

const sendNotice = async (today, message) => {
    slack.webhook({
        icon_emoji: ':beach_with_umbrella:',
        username: 'RRD 부재자 알림봇',
        text: `${today} RRD 부재자 명단입니다.`,
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

exports.sendNotice = sendNotice