const Promise = require('bluebird')
const debug = require('debug')('rabrpc.sub')

module.exports = function makeSubscribeHandler (handler) {
  const handleSubscribe = Promise.method(handler)
  return function subscribeHandler (message) {
    message.ack()
    debug('[SUB] %s payload: %j', message.type, message.body.payload)
    return handleSubscribe(message.body.payload, message.type)
  }
}
