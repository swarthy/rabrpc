const rabbot = require('rabbot')
const utils = require('../utils')

module.exports = function pub (messageType, payload, options) {
  const {exchangeName, serviceName: channelName} = utils.parseMessageType('pub-sub', messageType)
  return rabbot.publish(exchangeName, Object.assign({
    routingKey: channelName,
    type: messageType,
    body: {payload}
  }, options))
}
