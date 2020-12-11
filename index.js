const noticer = require('./utils/noticer.js')
const express = require('express')
const app = express()
const PORT = process.env.PORT

app.get("/", (req, res) => {
    noticer.notify()
    res.send({ message: 'Notification will be sent soon ... please wait' });
});

app.listen(PORT);