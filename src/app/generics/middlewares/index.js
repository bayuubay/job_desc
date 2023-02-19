const jwt = require('jsonwebtoken')
const error = require('../error/error_generator')
const { user } = require('../../../data/database/models')

module.exports = {
  auth: async (req, res, next) => {
    try {
      if (!req.headers || !req.headers.authorization) {
        error({ name: 'TokenRequiredError', code: 400, message: 'Token is required.' })
      }
      const authorization = req.headers.authorization
      const token = authorization.split(' ')[1]
      const secret = process.env.ACCESS_TOKEN_SECRET
      const auth = await jwt.verify(token, secret) ?? null
      const isUserDeleted = await user.findOne({
        where: { id: auth?.data?.user_id },
        include: [
          {
            model: user_unit,
            attributes: ['id', 'last_active', 'is_approved', 'status_id'],
            include: [
              {
                model: unit,
                attributes: ['id', 'code', 'unit_name', 'cluster_id', 'cluster', 'unit_no']
              }
            ],
            separate: true,
            order: [['last_active', 'DESC NULLS LAST']]
          }
        ],
        paranoid: true
      })
      if (!isUserDeleted) {
        error({ name: 'UserForbiddenAccessError', code: 402, message: 'Account has been deleted.' })
      }
      auth.data.user_units = isUserDeleted?.user_units
      req.user = auth
      next()
    } catch (error) {
      next(error)
    }
  },
  authCompany: async (req, res, next) => {
    try {
      if (!req.headers || !req.headers.authorization) {
        error({ name: 'TokenRequiredError', code: 400, message: 'Token is required.' })
      }
      const authorization = req.headers.authorization
      const token = authorization.split(' ')[1]
      const secret = process.env.ACCESS_TOKEN_SECRET
      const auth = await jwt.verify(token, secret) ?? null
      if (auth && auth.data.is_a_resident) {
        error({ name: 'ForbiddenError', code: 403, message: 'Forbidden' })
      }
      const isUserDeleted = await user.findOne({
        where: { id: auth.data.user_id },
        paranoid: true
      })
      if (!isUserDeleted) {
        error({ name: 'UserForbiddenAccessError', code: 402, message: 'Account has been deleted.' })
      }
      req.user = auth
      next()
    } catch (error) {
      next(error)
    }
  },
  authMobile: async (req, res, next) => {
    try {
      if (!req.headers || !req.headers.authorization) {
        error({ name: 'TokenRequiredError', code: 400, message: 'Token is required.' })
      }
      const authorization = req.headers.authorization
      const token = authorization.split(' ')[1]
      const secret = process.env.ACCESS_TOKEN_SECRET
      const auth = await jwt.verify(token, secret) ?? null
      if (auth && auth.data.platform !== 'mobile') {
        error({ name: 'ForbiddenError', code: 403, message: 'Forbidden' })
      }
      const isUserDeleted = await user.findOne({
        where: { id: auth.data.user_id },
        paranoid: true
      })
      if (!isUserDeleted) {
        error({ name: 'UserForbiddenAccessError', code: 402, message: 'Account has been deleted.' })
      }
      req.user = auth
      next()
    } catch (error) {
      next(error)
    }
  },
  authRefresh: async (req, res, next) => {
    if (!req.headers || !req.headers.authorization) {
      error({ name: 'TokenRequiredError', code: 401, message: 'Token is required.' })
    }
    const authorization = req.headers.authorization
    const tokenHeader = authorization.split(' ')[1]
    try {
      const secret = process.env.REFRESH_TOKEN_SECRET
      const auth = await jwt.verify(tokenHeader, secret)
      const selectedToken = await token.findOne({ where: { token: tokenHeader, type: 'refresh' } })
      if (!selectedToken) {
        error({ name: 'TokenExpiredError', code: 401, message: 'Token expired.' })
        next()
      } else {
        await token.destroy({ where: { token: tokenHeader } })
        req.user = auth
        next()
      }
    } catch (error) {
      await token.destroy({ where: { token: tokenHeader } })
      next(error)
    }
  }
}
