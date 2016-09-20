const rabbot = require('rabbot')

module.exports = function send (messageType, payload, options) {
  const serviceName = messageType.split('.')[1] // v1.service-name.action.subaction
  const exchangeName = `send-recv.${serviceName}`
  const exchange = rabbot.getExchange(exchangeName)
  if (!exchange) {
    throw new Error(`Exchange with name '${exchangeName}' does not exist`)
  }
  return rabbot.publish(exchangeName, Object.assign({
    routingKey: serviceName,
    type: messageType,
    body: {payload}
  }, options))
}
