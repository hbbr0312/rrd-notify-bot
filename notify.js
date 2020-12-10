
// TODO: uri, id, pw 등 env로 빼기
const Slack = require('slack-node')
const webhookuri = 'https://hooks.slack.com/services/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'
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
        username: 'RRD 휴가자 알림봇',
        text: `${date}:${message}`,
        attachments: [
            {
                fallback: "fallback",
                pretext: "pretext",
                color: "#00FFFF",
                fields: [
                    {
                        title: "알림",
                        value: "해당링크를 클릭하여 검색해 보세요.",
                        short: false
                    }
                ]
            }
        ]
    }, function (err, response) {
        console.log(response);
    });
}

sendNotice('scheduler!')