const webhookuri = process.env.WEBHOOK_URI
// const webhookuri = 'https://hooks.slack.com/services/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'
const Slack = require('slack-node')
const slack = new Slack()
slack.setWebhook(webhookuri)

const formatDate = () => {
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