const Promise = require('bluebird')

module.exports = function makeSubscribeHandler (handler) {
  const handleSubscribe = Promise.method(handler)
  return function subscribeHandler (message) {
    message.ack()
    return handleSubscribe(message.body.payload, message.type)
  }
}
