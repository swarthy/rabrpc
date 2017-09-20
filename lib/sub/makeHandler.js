const debug = require('debug')('rabrpc.sub')

module.exports = function makeSubscribeHandler(handler, raw) {
  return async function subscribeHandler(message) {
    if (this.initialized) {
      message.ack()
    } else {
      console.warn(
        '[RabRPC.Subscribe] RabRPC is not initialized. skip message.ack()'
      )
    }
    debug('[SUB] %s payload: %o', message.type, message.body)
    return await handler(raw ? message : message.body, message.type)
  }.bind(this)
}
