const rabbot = require('rabbot')
const utils = require('../utils')

module.exports = function send (messageType, payload, options = {}) {
  const {
    exchangeName, serviceName
  } = utils.parseMessageType('send-recv', messageType, options.connectionName)

  return rabbot.publish(exchangeName, Object.assign({
    routingKey: serviceName,
    type: messageType,
    body: {payload}
  }, options), options.connectionName)
}
