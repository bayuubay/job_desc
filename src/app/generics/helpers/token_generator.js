const jwt = require('jsonwebtoken')

module.exports = {
  createToken: (payload) => {
    const { id, name, email} = payload
    const data = {
      user_id: id,
      name,
      email
    }
    const iat = Math.floor(new Date().getTime() / 1000)
    const secret = process.env.ACCESS_TOKEN_SECRET
    const duration = Number(process.env.ACCESS_TOKEN_EXPIRED || '86400')
    const access_payload = {
      iat,
      exp: iat + duration,
      data
    }
    const token = {
      type: 'Bearer',
      expires_in: duration,
      access_token: jwt.sign(access_payload, secret),
    }
    return token
  }
}
