'use strict'

const config = require('config')
const winston = require('winston')

const logger = winston.createLogger({
  level: config.logger.level,
  format: winston.format.json(),
  defaultMeta: { service: 'service-todos' },
  transports: [new winston.transports.Console({ format: winston.format.simple() })]
})

const app = require('./lib/app')

const dbClient = require('./lib/db')(logger)

const dependencies = {
  dbClient,
  logger
}

const server = app(dependencies).listen(config.app.port || 80)

server.on('close', () => {
  logger.info('SERVER SHUTDOWN')
  dbClient.close()
})
