const url = require('url')
const config = require('config')
const request = require('superagent')
const VError = require('verror')

const HOST = config.services.weather.host
const PROTOCOL = config.services.weather.protocol

const SERVICE_UNREACHABLE = 'SERVICE_UNREACHABLE'

function errorHandler(err) {
  if (err.code === 'ECONNREFUSED') {
    const error = new VError({
      name: SERVICE_UNREACHABLE,
      cause: err,
      info: { code: 'ECONNREFUSED' }
    }, 'Weather service is unreachable')
    throw error
  }

  const error = new VError({
    name: 'GET_WEATHER_ERROR',
    cause: err,
  }, 'Unexpected error on getting weather informations')

  throw error
}

async function getWeatherByCity(city) {
  const requestURL = url.format({
    protocol: PROTOCOL,
    hostname: HOST,
    pathname: `/services/json/${city}`,
  })

  try {
    const response = await request.get(requestURL)
    const { date, hour, temperature, humidity, pressure, wnd_spd, wnd_dir } = response.body.current_condition
    const result = { date, hour, temperature, humidity, pressure, wnd_spd, wnd_dir }
    return result
  } catch (err) {
    errorHandler(err)
  }
}

module.exports = {
  getWeatherByCity,
}
