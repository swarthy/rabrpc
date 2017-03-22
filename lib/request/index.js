const rabbot = require('rabbot')
const utils = require('../utils')
const responseHandler = require('./responseHandler')

module.exports = function request (messageType, payload, options = {}) {
  const {
    exchangeName, serviceName
  } = utils.parseMessageType('req-res', messageType, options.connectionName)

  return rabbot.request(exchangeName, Object.assign({
    routingKey: serviceName,
    type: messageType,
    body: {payload}
  }, options), options.connectionName)
  .then(responseHandler)
}
