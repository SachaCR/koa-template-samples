const config = require('config')
const assert = require('assert')
const app = require('../../lib/app')
const logger = require('../mocks/logger')
const bootstrapDB = require('../mocks/bootstrapDB')
const request = require('superagent')

describe('DELETE /todos', async () => {

  it('Should delete a todo', async () => {
    const dbClient = require('../../lib/db')(logger)
    await bootstrapDB()
    await dbClient.query(`
      INSERT INTO todos (id, title, done, todo_priority, created_at)
      VALUES
        (1, 'todo 1', false, 0, NOW()),
        (2, 'todo 2', false, 0, NOW()),
        (3, 'todo 3', false, 0, NOW())`)
    const server = app({ dbClient, logger }).listen(config.app.port)

    const response = await request
      .delete('http://localhost/todos')
      .send({ ids: [1] })
      .catch(err => err.response)

    server.close()
    assert.deepStrictEqual(response.body, {}, 'Response body should be equal "No Content"')
    assert.deepStrictEqual(response.status, 204, 'Status code should be 204')

    const todos = await dbClient.query(`
      SELECT done, id, todo_priority AS priority, title
      FROM todos ORDER BY id
    `).then(res => res.rows)

    assert.deepStrictEqual(todos.length, 2, 'The number of todos that left in DB should be 2')
    assert.deepStrictEqual(todos[0].id, 2, 'Todo id 2 should still be in Database')
    assert.deepStrictEqual(todos[1].id, 3, 'Todo id 3 should still be in Database')

    await dbClient.close()
  })

  it('Should delete multiple todos', async () => {
    const dbClient = require('../../lib/db')(logger)
    await bootstrapDB()
    await dbClient.query(`
      INSERT INTO todos (id, title, done, todo_priority, created_at)
      VALUES
        (1, 'todo 1', false, 0, NOW()),
        (2, 'todo 2', false, 0, NOW()),
        (3, 'todo 3', false, 0, NOW())`)
    const server = app({ dbClient, logger }).listen(config.app.port)

    const response = await request
      .delete('http://localhost/todos')
      .send({ ids: [1, 2, 3] })
      .catch(err => err.response)

    server.close()
    assert.deepStrictEqual(response.body, {}, 'Response body should be equal "No Content"')
    assert.deepStrictEqual(response.status, 204, 'Status code should be 204')

    const todos = await dbClient.query(`
      SELECT done, id, todo_priority AS priority, title
      FROM todos ORDER BY id
    `).then(res => res.rows)
    assert.deepStrictEqual(todos.length, 0, 'The number of todos that left in DB should be 0')
    await dbClient.close()
  })

  it('Should return an error invalid payload', async () => {
    const server = app({ logger }).listen(config.app.port)

    const response = await request
      .delete('http://localhost/todos')
      .send({ ids: ['invalid_id', 2, 3] })
      .catch(err => err.response)

    server.close()
    assert.deepStrictEqual(response.body, {
      error: 'AJV_INVALID_PAYLOAD',
      info: {
        errors: [
          {
            dataPath: '.ids[0]',
            keyword: 'type',
            message: 'should be integer',
            params: {
              type: 'integer',
            },
            schemaPath: '#/properties/ids/items/type',
          },
        ],
      },
      message: 'AJV detect an invalid payload',
    }, 'Response body should be an error with the details')
    assert.deepStrictEqual(response.status, 400, 'Status code should be 400')
  })

  it('Should return an error on database failure', async () => {
    const server = app({
      dbClient: {
        connect: async () => {
          return {
            query: async (query, params) => {
              if (params && params[0] === 2) {
                throw new Error('Cannot delete todo 2')
              }
            },
            done: async () => { }
          }
        }
      }, logger
    }).listen(config.app.port)

    const response = await request
      .delete('http://localhost/todos')
      .send({ ids: [1, 2, 3] })
      .catch(err => err.response)

    server.close()

    assert.deepStrictEqual(response.body, {
      error: 'DELETE_TODO_ERROR',
      info: {
        id: 2
      },
      message: 'Something went wrong while deleting todo: Cannot delete todo 2',
    }, 'Response body should be an error with error messages concatenated by verror module')
    assert.deepStrictEqual(response.status, 500, 'Status code should be 500')
  })

})
