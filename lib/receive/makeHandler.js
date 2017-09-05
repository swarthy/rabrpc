const Promise = require('bluebird')
const debug = require('debug')('rabrpc.recv')

const makeActions = require('./makeActions')

module.exports = function makeReceiveHandler(handler) {
  const handleReceive = Promise.method(handler)
  return function receiveHandler(message) {
    const actions = makeActions(message)
    debug('[RECEIVE] %s payload: %j ', message.type, message.body)
    return handleReceive(message.body, actions, message.type)
      .then(() => {
        if (!actions.processed) {
          debug('message is not processed, promise fulfilled, acking')
          return message.ack()
        }
      })
      .catch(err => {
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
          return message.nack()
        }
      })
  }
}
