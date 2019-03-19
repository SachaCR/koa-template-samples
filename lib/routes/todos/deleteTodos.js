const koaValidator = require('koa-validator-ajv')

const controller = require('../../controllers/todos')

const schema = {
  id: 'deleteTodos',
  type: 'object',
  additionalProperties: false,
  properties: {
    ids: {
      type: 'array',
      items: { type: 'integer' }
    },
  },
  required: ['ids']
}

async function deleteTodosHandler(ctx) {
  const dbClient = ctx.deps.dbClient

  /**
   * Create a connection outside of the pool to be sure
   * to use the same connection for all requests in the transaction
  */
  const connection = await dbClient.connect()

  try {
    connection.query('BEGIN')

    const promiseList = ctx.request.body.ids.map(async (id) => controller.deleteTodo(id, connection))

    await Promise.all(promiseList)

    connection.query('COMMIT')

    ctx.status = 204
  } catch (err) {
    connection.query('ROLLBACK')
    ctx.throw(err)
  } finally {
    await connection.done() // After all requests release the connection
  }
}

module.exports = {
  validator: koaValidator.bodyValidator(schema),
  handler: deleteTodosHandler,
}

/**
 * @api {delete} /todos Delete a list of Todos
 * @apiGroup todos
 * @apiName deleteTodos
 *
 * @apiParamExample {json} Request-Body-Example:
  {
    ids; [1, 2, 3]
  }
 *
 * @apiSuccessExample Success-Body-Response:
 * HTTP/1.1 204 No Content
  {
    data: 'Deleted'
  }
 *
 * @apiError {String} AJV_INVALID_PAYLOAD Invalid payload
 *
 * @apiErrorExample AJV_INVALID_PAYLOAD:
 *   HTTP/1.1 400 Bad Request
    {
      error: 'AJV_INVALID_PAYLOAD',
      info: {
        errors: [
          {
            dataPath: '',
            keyword: 'required',
            message: 'should have required property \'ids\'',
            params: {
              missingProperty: 'ids',
            },
            schemaPath: '#/required',
          },
        ],
      },
      message: 'AJV detect an invalid payload',
    }
 */
