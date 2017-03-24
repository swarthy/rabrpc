const rabbot = require('rabbot')
const utils = require('../utils')
const debug = require('debug')('rabrpc.pub')

module.exports = function pub (messageType, payload, options = {}) {
  const {
    exchangeName, serviceName
  } = utils.parseMessageType('pub-sub', messageType, options.connectionName)

  debug('[PUBLISH] %s payload: %j', messageType, payload)
  return rabbot.publish(exchangeName, Object.assign({
    routingKey: serviceName,
    type: messageType,
    body: {payload}
  }, options), options.connectionName)
}
