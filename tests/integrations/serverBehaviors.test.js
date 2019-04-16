const config = require('config')
const assert = require('assert')
const app = require('../../lib/app')
const logger = require('../mocks/logger')
const bootstrapDB = require('../mocks/bootstrapDB')
const request = require('superagent')

describe('Server behaviors', async () => {

  it('Should launch server with no dependencies injected', async () => {
    const server = app().listen(config.app.port)
    server.close()
  })

  it('Should return a 404 Not Found error', async () => {
    const dbClient = require('../../lib/db')(logger)
    await bootstrapDB()
    const server = app({ dbClient, logger }).listen(config.app.port)

    const response = await request.get('http://localhost:8080/notFound').catch(err => err.response)
    server.close()
    await dbClient.close()

    assert.deepStrictEqual(response.text, 'Not Found', 'Response text should be "Not Found"')
    assert.deepStrictEqual(response.status, 404, 'Status code should be 404')
  })

})
