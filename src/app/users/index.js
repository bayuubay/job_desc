const db = require('../../data/database/models')
const err = require('../generics/error/error_generator')
const { hash } = require('../generics/helpers/tools')
const { generate } = require('../generics/helpers/string_generator')
const { validatePassword } = require('../generics/helpers/tools')
const { createToken } = require('../generics/helpers/token_generator')
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
    try {
      const {body: {email, password}} = payload
      if(!email || !password) err({name: 'BadRequestError', code: 400, message: 'Email and password are required.'})
      const existUser = await db.user.findOne({where: {email}})
      if(!existUser) err({name: 'NotFoundError', code: 404, message: 'Email is not registered.'})
      const isValid = validatePassword(existUser, password)
      if(!isValid)err({name: 'Unauthorized', code: 401, message: 'Wrong password.'})
      const token = createToken(existUser)
      const data = {
        profile:
          {
            user_id: existUser.id,
            name: existUser.name,
            email: existUser.email
          },
        token
      }

      return {
        data,
        message: 'Login success.'
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = User