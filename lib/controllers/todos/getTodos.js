const VError = require('verror')

async function getTodos(dbClient) {

  try {
    const results = await dbClient.query(`
      SELECT id, title, todo_priority AS priority, done
      FROM todos
    `,).then((res) => res.rows)

    return results
  } catch (err) {
    const error = new VError({
      name: 'GET_TODOS_ERROR',
      cause: err,
    }, 'Something went wrong while getting todos')
    throw error
  }
}

module.exports = getTodos
