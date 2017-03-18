const Promise = require('bluebird')
const debug = require('debug')('rabrpc.recv')

const makeActions = require('./makeActions')

module.exports = function makeReceiveHandler (handler) {
  return message => {
    const actions = makeActions(message)
    return Promise.resolve(handler(message.body.payload, actions, message.type))
    .then(result => {
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
        console.error('[RabRPC] While processing "%s" with payload %j got error (to disable logging, catch it manually):', message.type, message.body.payload, err)
        return message.nack()
      }
    })
  }
}
