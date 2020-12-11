const noticer = require('./utils/noticer.js')
const express = require('express')
const app = express()
const PORT = process.env.PORT

app.get("/", async (req, res) => {
    await noticer.notify()
    res.send({ notify: true });
});

app.listen(PORT);