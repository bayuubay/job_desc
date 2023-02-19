const jwt = require('jsonwebtoken')

module.exports = {
  createToken: (payload) => {
    const data = {
      user_id: payload.user_entity.id,
      platform: payload.platform,
      is_a_resident: payload.user_entity.is_a_resident,
      // unit_id: payload.user_entity.unit_id
      role_id: payload.user_entity.role_id
    }
    const iat = Math.floor(new Date().getTime() / 1000)
    const secret = process.env.ACCESS_TOKEN_SECRET
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET
    const duration = Number(process.env.ACCESS_TOKEN_EXPIRED)
    const durationRefresh = Number(process.env.REFRESH_TOKEN_EXPIRED)
    const access_payload = {
      iat,
      exp: iat + duration,
      data
    }
    const refresh_payload = {
      iat,
      exp: iat + durationRefresh,
      data
    }
    const token = {
      type: 'Bearer',
      expires_in: duration,
      access_token: jwt.sign(access_payload, secret),
      refresh_token: jwt.sign(refresh_payload, refreshSecret)
    }
    return token
  },
  forgotToken: (payload) => {
    const data = {
      user_id: payload.id
    }
    const iat = Math.floor(new Date().getTime() / 1000)
    const secret = process.env.ACCESS_TOKEN_SECRET
    const duration = 24 * 60 * 60 // 24 hours
    const access_payload = {
      iat: iat,
      exp: iat + Number(duration),
      data: data
    }
    const token = {
      type: 'Bearer',
      expires_at: access_payload.exp,
      expires_in: access_payload.exp - access_payload.iat,
      access_token: jwt.sign(access_payload, secret)
    }
    return token
  }
}
