const rabbot = require('rabbot')
const utils = require('../utils')

module.exports = function pub (messageType, payload, options = {}) {
  const {
    exchangeName, serviceName
  } = utils.parseMessageType('pub-sub', messageType, options.connectionName)

  return rabbot.publish(exchangeName, Object.assign({
    routingKey: serviceName,
    type: messageType,
    body: {payload}
  }, options))
}
