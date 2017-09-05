const rabbot = require('rabbot')
const utils = require('../utils')
const debug = require('debug')('rabrpc.req')
const responseHandler = require('./responseHandler')

module.exports = function request(messageType, payload, options = {}) {
  const { exchangeName, serviceName } = utils.parseMessageType(
    'req-res',
    messageType,
    options.connectionName
  )

  const finalOptions = Object.assign(
    {
      routingKey: serviceName,
      type: messageType,
      body: payload
    },
    options,
    {
      headers: Object.assign({}, options.headers, {
        protocol: 1
      })
    }
  )

  debug(
    '[REQUEST] %s options: %o payload: %o',
    messageType,
    finalOptions,
    payload
  )
  return rabbot
    .request(exchangeName, finalOptions, options.connectionName)
    .then(responseHandler)
}
