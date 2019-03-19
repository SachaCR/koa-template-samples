const VError = require('verror')

async function createTodo(todoData, dbClient) {
  const { title, priority, done } = todoData

  try {
    const result = await dbClient.query(`
      INSERT INTO todos (title, todo_priority, done, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING
        id,
        title,
        todo_priority AS priority,
        done
    `, [title, priority, done])
      .then((res) => res.rows[0])

    return result
  } catch (err) {

    const error = new VError({
      name: 'CREATE_TODO_ERROR',
      cause: err,
      info: { title, priority, done }
    }, 'Something went wrong while inserting new todo')

    throw error
  }
}

module.exports = createTodo
