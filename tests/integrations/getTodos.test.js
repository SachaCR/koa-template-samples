const config = require('config')
const assert = require('assert')
const app = require('../../lib/app')
const logger = require('../mocks/logger')
const bootstrapDB = require('../mocks/bootstrapDB')
const request = require('superagent')
const nock = require('nock')

const HOST = config.services.weather.host
const PROTOCOL = config.services.weather.protocol

describe('GET /todos', async () => {

  it('Should get all todos and weather informations', async () => {
    const dbClient = require('../../lib/db')(logger)
    await bootstrapDB()
    await dbClient.query(`
      INSERT INTO todos (id, title, done, todo_priority, created_at)
      VALUES
        (1, 'todo 1', false, 0, NOW()),
        (2, 'todo 2', false, 0, NOW()),
        (3, 'todo 3', false, 0, NOW())`)

    nock(`${PROTOCOL}://${HOST}`)
      .get('/services/json/Paris')
      .reply(200, {
        current_condition: {
          date: '17-03-2019',
          hour: '15:00',
          temperature: 30,
          humidity: 59,
          pressure: 1000.4,
          wnd_spd: 30,
          wnd_dir: 'SO',
        }
      })

    const server = app({ dbClient, logger }).listen(config.app.port)

    const response = await request
      .get('http://localhost:8080/todos')
      .catch(err => err.response)

    server.close()
    await dbClient.close()

    assert.deepStrictEqual(response.body.data.todos.length, 3, 'Response body todos should contains 3 todos')
    assert.deepStrictEqual(response.body.data.weather, {
      date: '17-03-2019',
      hour: '15:00',
      temperature: 30,
      humidity: 59,
      pressure: 1000.4,
      wnd_spd: 30,
      wnd_dir: 'SO',
    }, 'Response body weather values should be as expected')
    assert.deepStrictEqual(response.status, 200, 'Status code should be 200')
  })

  it('Should return a 500 error if weather service return a 500 error', async () => {
    const dbClient = require('../../lib/db')(logger)
    await bootstrapDB()
    await dbClient.query(`
      INSERT INTO todos (id, title, done, todo_priority, created_at)
      VALUES
        (1, 'todo 1', false, 0, NOW()),
        (2, 'todo 2', false, 0, NOW()),
        (3, 'todo 3', false, 0, NOW())`)

    nock(`${PROTOCOL}://${HOST}`)
      .get('/services/json/Paris')
      .reply(500)

    const server = app({ dbClient, logger }).listen(config.app.port)

    const response = await request
      .get('http://localhost:8080/todos')
      .catch(err => err.response)

    server.close()
    await dbClient.close()

    assert.deepStrictEqual(response.body, {
      error: 'GET_WEATHER_ERROR',
      info: {},
      message: 'Unexpected error on getting weather informations: Internal Server Error',
    }, 'Response body should be a valid error object')
    assert.deepStrictEqual(response.status, 500, 'Status code should be 500')
  })

  it('Should return a 503 error if service get an ECONNREFUSED error', async () => {
    const dbClient = require('../../lib/db')(logger)
    await bootstrapDB()
    await dbClient.query(`
      INSERT INTO todos (id, title, done, todo_priority, created_at)
      VALUES
        (1, 'todo 1', false, 0, NOW()),
        (2, 'todo 2', false, 0, NOW()),
        (3, 'todo 3', false, 0, NOW())`)

    const error = new Error('Connection refused')
    error.code = 'ECONNREFUSED'
    nock(`${PROTOCOL}://${HOST}`)
      .get('/services/json/Paris')
      .replyWithError(error)

    const server = app({ dbClient, logger }).listen(config.app.port)

    const response = await request
      .get('http://localhost:8080/todos')
      .catch(err => err.response)

    server.close()
    await dbClient.close()

    assert.deepStrictEqual(response.body, {
      error: 'SERVICE_UNREACHABLE',
      info: {
        code: 'ECONNREFUSED'
      },
      message: 'Weather service is unreachable: Connection refused',
    }, 'Response body should be a valid error object')
    assert.deepStrictEqual(response.status, 503, 'Status code should be 503')
  })

  it('Should return a 503 error if database service is down', async () => {
    const dbClient = require('../../lib/db')(logger)
    await bootstrapDB()
    await dbClient.query(`
      INSERT INTO todos (id, title, done, todo_priority, created_at)
      VALUES
        (1, 'todo 1', false, 0, NOW()),
        (2, 'todo 2', false, 0, NOW()),
        (3, 'todo 3', false, 0, NOW())`)

    const server = app({
      dbClient: {
        query: async () => {
          throw new Error('Database is down')
        }
      }, logger }).listen(config.app.port)

    const response = await request
      .get('http://localhost:8080/todos')
      .catch(err => err.response)

    server.close()
    await dbClient.close()

    assert.deepStrictEqual(response.body, {
      error: 'GET_TODOS_ERROR',
      info: {},
      message: 'Something went wrong while getting todos: Database is down',
    }, 'Response body should be a valid error object')
    assert.deepStrictEqual(response.status, 503, 'Status code should be 503')
  })

})
