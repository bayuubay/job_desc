const express = require('express')
const router = express.Router()

const user = require('./user')
const job = require('./job')

router.get('/', (req, res, next) => {
  res.status(200).json({
    title: process.env.APP_NAME,
    version: process.env.APP_VERSION
  })
})


router.use('/users', user)
router.use('/jobs', job)

module.exports = router
