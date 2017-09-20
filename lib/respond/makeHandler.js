const debug = require('debug')('rabrpc.res')

const makeActions = require('./makeActions')

module.exports = function makeHandler(handler, raw) {
  return async function respondHandler(message) {
    const actions = makeActions(message)
    debug('[RESPOND] %s payload: %j', message.type, message.body)
    try {
      const result = await handler(
        raw ? message : message.body,
        actions,
        message.type
      )
      if (!actions.processed) {
        debug(
          'message is not processed, returning promise value with success status'
        )
        if (this.initialized) {
          return await actions.success(result)
        } else {
          console.warn(
            '[RabRPC.Respond] RabRPC is not initialized. skip actions.success()'
          )
        }
      }
    } catch (err) {
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
        if (this.initialized) {
          return await actions.error(err) // catch error
        } else {
          console.warn(
            '[RabRPC.Respond] RabRPC is not initialized. skip actions.error()'
          )
        }
      }
    }
  }.bind(this)
}
