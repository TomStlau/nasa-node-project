const express = require('express')
const cors = require('cors')
const morg = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')
const v1 = require('./routes/v1')
const app = express()
app.use(cors({ origin: ['http://127.0.0.1:3000', 'http://localhost:3000'] }))
app.use(morg('combined'))
app.use(bodyParser.json())
app.use('/v1', v1)
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})
module.exports = app
