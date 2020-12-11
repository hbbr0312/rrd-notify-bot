const express = require('express')
const app = express()
const PORT = process.env.PORT
const noticer = require('./utils/noticer.js')

app.get("/", async (req, res) => {
    noticer.notify()
    res.send({ vacationers });
});

app.listen(PORT);