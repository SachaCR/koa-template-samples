const VError = require('verror')

module.exports = async(ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.deps.logger.error(err)

    ctx.status = err.status || 500

    ctx.body = {
      error: err.name || 'UNKNOWN_ERROR',
      message: err.message,
      info: VError.info(err)
    }

  }
}
