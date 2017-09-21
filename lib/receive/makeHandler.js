const debug = require('debug')('rabrpc.recv')

const makeActions = require('./makeActions')

module.exports = function makeReceiveHandler(handler, raw) {
  return async function receiveHandler(message) {
    const actions = makeActions(this, message)
    debug('[RECEIVE] %s payload: %j ', message.type, message.body)
    try {
      console.log('calling handler', handler)
      await handler(raw ? message : message.body, actions, message.type)
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
          message.body,
          err
        )
        return await actions.nack()
      }
    }
  }.bind(this)
}
