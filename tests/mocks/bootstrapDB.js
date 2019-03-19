
const fs = require('fs')
const path = require('path')

const logger = require('./logger')

async function bootstrapDB() {
  const dbClient = require('../../lib/db')(logger)
  const sqlScript = fs.readFileSync(path.resolve(__dirname, '../../config/bootstrapDB.sql')).toString()
  await dbClient.query(sqlScript)
  await dbClient.close()
}

module.exports = bootstrapDB
