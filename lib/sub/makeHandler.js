const Promise = require('bluebird')
const debug = require('debug')('rabrpc.sub')

module.exports = function makeSubscribeHandler(handler) {
  const handleSubscribe = Promise.method(handler)
  return function subscribeHandler(message) {
    message.ack()
    debug('[SUB] %s payload: %o', message.type, message.body)
    return handleSubscribe(message.body, message.type)
  }
}
