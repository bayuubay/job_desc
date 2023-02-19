const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const indexRouter = require('./routes/index')
const app = express()

app.use(logger('combined'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false }))
app.use(cors())

app.use('/api', indexRouter)

module.exports = app
