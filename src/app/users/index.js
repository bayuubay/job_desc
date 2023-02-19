const db = require('../../data/database/models')
const err = require('../generics/error/error_generator')
const { hash } = require('../generics/helpers/tools')
const { generate } = require('../generics/helpers/string_generator')
class User {
  async create(payload){
    let transaction = await db.sequelize.transaction()
    try {
      const {body: {name, email, password}} = payload
      if(!name || !email || !password) err({name: 'BadRequestError', code: 400, message: 'Request payload is required'})
      const userExist = await db.user.findOne({ where: { email }, transaction })
      if (userExist) err({ name: 'BadRequestError', code: 400, message: 'Email has been registred' })
      const salt = generate()
      const hasedPassword = await hash(password, salt)

      const dataUser = {
        name,
        email,
        salt,
        password : hasedPassword
      }

      await db.user.create(dataUser, {transaction, returning: ['id', 'name', 'email']})

      await transaction.commit()

      return {
        data: {
          name,
          email
        },
        message: 'Success'
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async login(payload){
    
  }
}

module.exports = User