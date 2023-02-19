module.exports = (obj) => {
  const { message, name, code } = obj
  const err = new Error(message)
  err.name = name
  err.code = +code
  throw err
}
