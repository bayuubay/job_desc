const express = require('express')
const router = express.Router()

const auth = require('./auth')
const user = require('./user')

router.get('/', (req, res, next) => {
  res.status(200).json({
    title: process.env.APP_NAME,
    version: process.env.APP_VERSION
  })
})

router.use('/auths', auth)
router.use('/users', user)

module.exports = router
