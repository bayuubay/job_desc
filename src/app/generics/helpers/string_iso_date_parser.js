const { DateTime } = require('luxon')

module.exports = {
  fromISOString: (stringDate) => {
    if (!stringDate || typeof stringDate !== 'string') {
      return null
    } else {
      let date = DateTime.fromISO(stringDate)
      if (date.invalid) {
        return null
      } else {
        return date.toFormat('yyyy-MM-dd')
      }
    }
  }
}