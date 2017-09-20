const rabbot = require('rabbot')
const utils = require('../utils')
const debug = require('debug')('rabrpc.send')

module.exports = function send(messageType, payload, options = {}) {
  const { exchangeName, serviceName } = utils.parseMessageType(
    'send-recv',
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

  debug('[SEND] %s options: %o payload: %o', messageType, finalOptions, payload)
  return rabbot.publish(exchangeName, finalOptions, options.connectionName)
}
