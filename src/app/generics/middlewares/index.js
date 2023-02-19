const jwt = require('jsonwebtoken')
const error = require('../error/error_generator')
const { user } = require('../../../data/database/models')

module.exports = {
  auth: async (req, res, next) => {
    try {
      if (!req.headers || !req.headers.authorization) {
        error({ name: 'Unauthorized', code: 401, message: 'Token is required.' })
      }
      const authorization = req.headers.authorization
      const token = authorization.split(' ')[1]
      const secret = process.env.ACCESS_TOKEN_SECRET
      const auth = await jwt.verify(token, secret) ?? null
      req.user = auth
      next()
    } catch (error) {
      next(error)
    }
  }
}
