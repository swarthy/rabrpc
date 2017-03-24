const rabbot = require('rabbot')
const utils = require('../utils')
const debug = require('debug')('rabrpc.req')
const responseHandler = require('./responseHandler')

module.exports = function request (messageType, payload, options = {}) {
  const {
    exchangeName, serviceName
  } = utils.parseMessageType('req-res', messageType, options.connectionName)

  debug('[REQUEST] %s payload: %j', messageType, payload)
  return rabbot.request(exchangeName, Object.assign({
    routingKey: serviceName,
    type: messageType,
    body: {payload}
  }, options), options.connectionName)
  .then(responseHandler)
}
