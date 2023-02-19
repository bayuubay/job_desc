const express = require('express')

const router = express.Router()
const {auth} = require('../../app/generics/middlewares')

const Job = require('../../app/jobs')
const job = new Job()
//route to handler here

router.get('/list', auth, async(req, res, next) => {
  try {
    const data = await job.list({query: req.query})
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
})


module.exports = router
