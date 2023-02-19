module.exports = (e) => {
  switch (e.name) {
    case 'SequelizeUniqueConstraintError':
      return {
        name: 'DuplicateEntryError',
        code: 400,
        message: e.message
      }
    case 'SequelizeDatabaseError':
      return {
        name: 'InvalidFormatError',
        code: 400,
        message: e.message
      }
    case 'JsonWebTokenError':
      return {
        name: 'InvalidTokenError',
        code: 401,
        message: 'Invalid token.'
      }
    case 'TokenExpiredError':
      return {
        name: 'TokenExpiredError',
        code: 401,
        message: 'Token expired.'
      }
    case 'BadRequestError':
    case 'NotFoundError':
    case 'Unauthorized':
    case 'ExternalServerError':
      return e
    default:
      console.log(e)
      return {
        name: 'InternalServerError',
        code: 500,
        message: 'Internal server error.'
      }
  }
}
