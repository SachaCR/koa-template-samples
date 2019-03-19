const VError = require('verror')

async function deleteTodo(id, dbClient) {
  try {
    return await dbClient.query('DELETE FROM todos WHERE id = $1', [id])
  } catch (err) {
    const error = new VError({
      name: 'DELETE_TODO_ERROR',
      cause: err,
      info: { id }
    }, 'Something went wrong while deleting todo')
    throw error
  }
}

module.exports = deleteTodo
