const rabbot = require('rabbot')

module.exports = function pub (messageType, payload, options) {
  const channelName = messageType.split('.')[1] // v1.channelName
  const exchangeName = `pub-sub.${channelName}`
  const exchange = rabbot.getExchange(exchangeName)
  if (!exchange) {
    throw new Error(`Exchange with name '${exchangeName}' does not exist`)
  }
  return rabbot.publish(exchangeName, Object.assign({
    routingKey: channelName,
    type: messageType,
    body: {payload}
  }, options))
}
