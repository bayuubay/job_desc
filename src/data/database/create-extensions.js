const Sequelize = require('sequelize')
const config = require('./config/config')[process.env.NODE_ENV]

const sequelize = new Sequelize(config.database, config.username, config.password, config)
const extensions = [
  'uuid-ossp',
  'pg_trgm'
]

console.log('creating extensions...')
extensions.forEach(ext => sequelize.query(`CREATE EXTENSION IF NOT EXISTS "${ext}"`))
