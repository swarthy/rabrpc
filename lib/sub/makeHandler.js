const Promise = require('bluebird')

module.exports = function makeSubscribeHandler (handler) {
  return message => {
    message.ack()
    return Promise.resolve().then(() => handler(message.body.payload, message.type))
  }
}
