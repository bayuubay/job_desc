const { IS_UUID } = require('./constants')
const err = require('../error/error_generator')

module.exports = (uuids, cause='UUID') => {
  uuids = Array.isArray(uuids) ? uuids : [uuids];
  const filtered_data = [];
  for (let idx = 0; idx < uuids.length; idx += 1) {
    const val = uuids[idx];
    if (val && val.length > 0) {
      if (!IS_UUID.test(val)) {
        return err({ name: 'BadRequestError', code: 400, message: `${cause} must be type of UUID.` })
      }
      filtered_data.push(val);
    }
  }
  return filtered_data.length > 0 ? filtered_data : null;
}