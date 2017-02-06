const Promise = require('bluebird')
const debug = require('debug')('rabrpc.res')

const makeResponseActions = require('./makeResponseActions')

module.exports = function makeHandler (handler) {
  return message => {
    const actions = makeResponseActions(message)
    return Promise.resolve().then(() => handler(message.body.payload, actions, message.type))
    .then(result => {
      if (!actions.processed) {
        debug('message is not processed, returning promise value with success status')
        return actions.success(result)
      }
    })
    .catch(err => {
      debug('error due message processing', err)
      if (actions.processed) {
        throw err // something goes wrong
      } else {
        debug('message is not processed, returning promise error with error object (should be plain object)')
        console.error(`[RabRPC] Respond "${message.type}" processing error (to disable logging, catch it manually):`, err)
        return actions.error(err) // catch error
      }
    })
  }
}
