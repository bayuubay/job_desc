module.exports = {
  input: (payload) => {
    try {
      let date = payload
      if(typeof payload === 'string') Number(date)
      if(Math.abs(Date.now() - payload) >= Math.abs(Date.now() - payload * 1000)){
        date = payload * 1000
      }
      return date
    } catch (error) {
      throw error
    }
  }
}