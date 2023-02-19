'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  hash: (str, salt) => {
    const password = str + salt
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    return hash
  },
  validatePassword: (user_entity, pwd) => {
    const hash = user_entity.password
    const password = pwd + user_entity.salt
    return bcrypt.compareSync(password, hash)
  }
}
