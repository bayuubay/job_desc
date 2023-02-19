'use strict'
const bcrypt = require('bcryptjs')

const shuffle = (string) => {
  const parts = string.split('')
  for (let i = parts.length; i > 0;) {
    const random = parseInt(Math.random() * i)
    const temp = parts[--i]
    parts[i] = parts[random]
    parts[random] = temp
  }
  return parts.join('')
}

const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const chr = (codePt) => {
  if (codePt > 0xFFFF) {
    codePt -= 0x10000
    return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF))
  }
  return String.fromCharCode(codePt)
}

const random = () => {
  const numbers = []
  for (let i = 0; i < 3; i++) {
    numbers.push(rand(0, 9))
  }

  const alphaLowers = []
  for (let i = 0; i < 3; i++) {
    alphaLowers.push(chr(rand(97, 122)))
  }

  const alphaUppers = []
  for (let i = 0; i < 4; i++) {
    alphaUppers.push(chr(rand(65, 90)))
  }

  const merge = [...numbers, ...alphaLowers, ...alphaUppers]
  const string = merge.join('')
  const salt = shuffle(string)
  return salt
}

function createSalt () {
  const length = 60
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return shuffle(result)
}

const hash = (str, salt) => {
  const password = str
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  return hash
}

const validatePassword = (user_entity, pwd) => {
  const hash = user_entity.password
  const password = pwd
  return bcrypt.compareSync(password, hash)
}

const getDistance = (lat1, lon1, lat2, lon2, unit) => {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist;
  }
}

module.exports = {
  createSalt,
  hash,
  validatePassword,
  random,
  getDistance
}
