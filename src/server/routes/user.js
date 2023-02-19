const express = require('express')

const router = express.Router()

const User = require('../../app/users')
const user = new User()
//route to handler here

router.post('/', async(req, res, next) => {
  try {
    const data = await user.create({body: req.body})
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
})

router.post('/login', async(req, res, next) => {
  try {
    const data = await user.login({body: req.body})
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
})


module.exports = router
