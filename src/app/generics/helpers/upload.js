const AWS = require('aws-sdk')
const fs = require('fs')
const randomString = require('./string_generator')
AWS.config.update({
  accessKeyId: process.env.KEY_ID,
  secretAccessKey: process.env.SECRET_KEY,
  region: 'ap-southeast-1'
})
const s3 = new AWS.S3()
const bucket = process.env.BUCKET_NAME
const err = require('../error/error_generator')

module.exports = {
  uploadS3: (files) => {
    const upload = (file) => {
      let filename = file.originalname
      const ext = filename.split('.').pop()
      if(file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
        err({ name: 'BadRequestError', message: 'Invalid file extension, must be type .jpg, .jpeg, .png', code: 400 })
      }
      const random = randomString.generate()
      filename = random + '.' + ext

      const path = file.path
      const params = {
        ACL: 'public-read',
        Bucket: bucket,
        Body: fs.createReadStream(path),
        Key: filename
      }
      return s3.upload(params).promise()
    }

    return new Promise((resolve, reject) => {
      const promises = []
      for (const file of files) {
        promises.push(upload(file))
      }

      Promise.all(promises)
        .then((datas) => {
          const imagesUrl = []
          for (let i = 0; i < datas.length; i++) {
            fs.unlinkSync(files[i].path)
            const url = datas[i].Location
            imagesUrl.push(url)
          }
          resolve(imagesUrl)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  uploadPdfS3: async (buffer, filename) => {
    try {
        const params = {
          ACL: 'private',
          Bucket: bucket,
          Body: buffer,
          Key: filename,
          ContentType: 'application/pdf',
          ContentDisposition: 'inline',
        }
        await s3.upload(params).promise()
        const url = s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: filename,
            Expires: Number(process.env.EXPIRED_TIME) || 3600
        })
        return url
    } catch (error) {
      throw error
    }
  },
}
