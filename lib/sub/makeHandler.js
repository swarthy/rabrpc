const debug = require('debug')('rabrpc.sub')

const parsePayload = require('../utils/parsePayload')

module.exports = function makeSubscribeHandler(handler, raw) {
  return async function subscribeHandler(message) {
    if (this.initialized) {
      message.ack()
    } else {
      console.warn(
        '[RabRPC.Subscribe] RabRPC is not initialized. skip message.ack()'
      )
    }
    const payload = parsePayload(message)
    debug('[SUB] %s payload: %o', message.type, payload)
    return await handler(raw ? message : payload, message.type)
  }.bind(this)
}
