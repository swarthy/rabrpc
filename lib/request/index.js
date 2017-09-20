const rabbot = require('rabbot')
const utils = require('../utils')
const debug = require('debug')('rabrpc.req')
const { bodyResponseHandler, messageResponseHandler } = require('./handlers')

module.exports = function request(
  messageType,
  payload,
  options = {},
  raw = false
) {
  const { exchangeName, serviceName } = utils.parseMessageType(
    'req-res',
    messageType,
    options.connectionName
  )

  const finalOptions = Object.assign(
    { contentType: utils.getContentType(payload) },
    options,
    {
      routingKey: serviceName,
      type: messageType,
      body: payload,
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
    .then(raw ? messageResponseHandler : bodyResponseHandler)
}
