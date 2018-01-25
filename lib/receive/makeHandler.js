const debug = require('debug')('rabrpc.recv')

const parsePayload = require('../utils/parsePayload')
const makeActions = require('./makeActions')

module.exports = function makeReceiveHandler(handler, raw) {
  return async function receiveHandler(message) {
    const actions = makeActions(message)
    const payload = parsePayload(message)
    debug('[RECEIVE] %s payload: %j ', message.type, payload)
    try {
      await handler(raw ? message : payload, actions, message.type)
      if (!actions.processed) {
        debug('message is not processed, promise fulfilled, acking')
        return await actions.ack()
      }
    } catch (err) {
      debug('error while processing message', err)
      if (actions.processed) {
        throw err // something goes wrong
      } else {
        debug('message is not processed, nacking')
        console.error(
          '[RabRPC] While processing "%s" with payload %j got error (to disable logging, catch it manually):',
          message.type,
          payload,
          err
        )
        return await actions.nack()
      }
    }
  }
}
