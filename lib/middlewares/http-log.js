
const chalk = require('chalk')

module.exports = async(ctx, next) => {
  const start = new Date()
  await next()
  const { method, path, body } = ctx.request
  const status = ctx.response.status
  let coloredStatus = status

  if (coloredStatus >= 500) {
    coloredStatus = chalk.red(coloredStatus)
  } else if (coloredStatus >= 400) {
    coloredStatus = chalk.yellow(coloredStatus)
  } else {
    coloredStatus = chalk.green(coloredStatus)
  }

  const responseTime =  new Date() - start
  const log = `${chalk.cyan(method)} ${path} ${coloredStatus}`
  ctx.deps.logger.info(log, { timestamp: start, method, path, body, status: status, responseTime })
}
