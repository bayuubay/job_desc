const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const indexRouter = require('./routes/index')
const errorHandler = require('../app/generics/error/error_handler')
const app = express()

app.use(logger('combined'))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false }))
app.use(cors())

app.use('/api', indexRouter)

app.use((err, req, res, next) => {
  const { name, code, message } = errorHandler(err)
  res.status(code).json({ name, message, code })
})

module.exports = app
