const controller = require('../../controllers/todos')
const weatherService = require('../../services/weather')

async function getTodosHandler(ctx) {
  try {
    const dbClient = ctx.deps.dbClient
    const todos = await controller.getTodos(dbClient)
    const city = 'Paris'
    const weather = await weatherService.getWeatherByCity(city)

    ctx.body = {
      data: {
        todos,
        weather,
      }
    }
  } catch (err) {
    if (err.name === 'SERVICE_UNREACHABLE') {
      ctx.throw(503, err)
    }

    if (err.name === 'GET_TODOS_ERROR') {
      ctx.throw(503, err)
    }

    ctx.throw(err)
  }
}

module.exports = {
  handler: getTodosHandler,
}

/**
 * @api {get} /todos Get all todos
 * @apiGroup todos
 * @apiName getTodos
 *
 * @apiSuccessExample Success-Body-Response:
 * HTTP/1.1 200 OK
  {
    data: {
      todos: [{
        id: 1
        title: 'Learn Koa',
        priority: 0,
        done: false
      }, ...
      ],
      weather: {
        date: 16.03.2019,
        hour: '14:00'
        temperature: 10,
        humidity: 76,
        pressure: 10009.5,
        wnd_spd: 29,
        wnd_dir: 'SO',
      }
    }
  }
 *
 *
 */
