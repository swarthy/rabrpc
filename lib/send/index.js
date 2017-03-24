const rabbot = require('rabbot')
const utils = require('../utils')
const debug = require('debug')('rabrpc.send')

module.exports = function send (messageType, payload, options = {}) {
  const {
    exchangeName, serviceName
  } = utils.parseMessageType('send-recv', messageType, options.connectionName)

  debug('[SEND] %s payload: %j', messageType, payload)
  return rabbot.publish(exchangeName, Object.assign({
    routingKey: serviceName,
    type: messageType,
    body: {payload}
  }, options), options.connectionName)
}
