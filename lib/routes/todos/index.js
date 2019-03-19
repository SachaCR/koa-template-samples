const Router = require('koa-router')
const createTodo = require('./createTodo')
const deleteTodos = require('./deleteTodos')
const getTodos = require('./getTodos')

const router = new Router({ prefix: '/todos' })

router.post('/', createTodo.validator, createTodo.handler)
router.delete('/', deleteTodos.validator, deleteTodos.handler)
router.get('/', getTodos.handler)

module.exports = router
