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
        const {data} = await axios.get(extUrl + '/positions.json' + queryPath)
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

  async detail(payload){
    try {
      const{params: {id}} = payload
      if(!id) err({name: 'BadRequestError', code: 400, message: 'Job ID is required'})
      if(!extUrl) err({name: 'ExternalServerError', code: 504, message: 'External server can\'t be reached'})
      let result
      try {
        const {data} = await axios.get(extUrl + '/positions/' + id)
        result = data
      } catch (error) {
        console.log(error);
        err({name: 'NotFoundError', code: 404, message: 'Data not found'})
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