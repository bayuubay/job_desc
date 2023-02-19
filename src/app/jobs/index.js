const axios = require('axios')
const extUrl = process.env.EXTERNAL_URL
const err = require('../generics/error/error_generator')
class Job {
  async list(payload){
    try {
      const{query} = payload
      let queryPath = '?'
      for (const q in query) {
        if (Object.hasOwnProperty.call(query, q)) {
          let element = query[q];
          queryPath += `${q}=${element}&`
        }
      }
      if(!extUrl) err({name: 'ExternalServerError', code: 504, message: 'External server can\'t be reached'})
      let result = []
      try {
        const {data} = await axios.get(extUrl + queryPath)
        result = data
      } catch (error) {
        result = []
      }

      return {
        data: result,
        message: 'Success fetch data'
      }
    } catch (error) {
      throw error
    }
  }

  
}

module.exports = Job