'use strict'

module.exports = {
  generate: (length = 60) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }

    const parts = result.split('')
    for (let i = parts.length; i > 0;) {
      const random = parseInt(Math.random() * i)
      const temp = parts[--i]
      parts[i] = parts[random]
      parts[random] = temp
    }

    return parts.join('')
  }
}
