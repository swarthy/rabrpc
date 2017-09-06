const Promise = require('bluebird')
const debug = require('debug')('rabrpc.res')

const makeActions = require('./makeActions')

module.exports = function makeHandler(handler, raw) {
  const handleRespond = Promise.method(handler)
  return function respondHandler(message) {
    const actions = makeActions(message)
    debug('[RESPOND] %s payload: %j', message.type, message.body)
    return handleRespond(raw ? message : message.body, actions, message.type)
      .then(result => {
        if (!actions.processed) {
          debug(
            'message is not processed, returning promise value with success status'
          )
          return actions.success(result)
        }
      })
      .catch(err => {
        debug('error due message processing', err)
        if (actions.processed) {
          throw err // something goes wrong
        } else {
          debug(
            'message is not processed, returning promise error with error object (can be plain object with error and code properties)'
          )
          console.error(
            '[RabRPC] While processing "%s" with payload %j got error (to disable logging, catch it manually):',
            message.type,
            message.body,
            err
          )
          return actions.error(err) // catch error
        }
      })
  }
}
