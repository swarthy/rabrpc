const rabbot = require('rabbot')
const responseHandler = require('./responseHandler')

module.exports = function request (messageType, payload, options) {
  const serviceName = messageType.split('.')[1] // v1.service-name.action.subaction
  const exchangeName = `req-res.${serviceName}`
  const exchange = rabbot.getExchange(exchangeName)
  if (!exchange) {
    throw new Error(`Exchange with name '${exchangeName}' does not exist`)
  }
  return rabbot.request(exchangeName, Object.assign({
    routingKey: serviceName,
    type: messageType,
    body: {payload}
  }, options))
  .then(responseHandler)
}
