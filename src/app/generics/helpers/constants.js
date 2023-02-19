/* eslint-disable no-useless-escape */
module.exports = Object.freeze({
  IS_URL: /^https?:\/\/[^\/]+/i,
  IS_UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  IS_EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  IS_TIME: /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/,
  IS_RTSP: /^rtsp:/i,
})
