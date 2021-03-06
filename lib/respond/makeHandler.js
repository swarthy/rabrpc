const debug = require('debug')('rabrpc.res')

const parsePayload = require('../utils/parsePayload')
const makeActions = require('./makeActions')

module.exports = function makeHandler(handler, raw) {
  return async function respondHandler(message) {
    const actions = makeActions(message)
    const payload = parsePayload(message)
    debug('[RESPOND] %s payload: %j', message.type, payload)
    try {
      const result = await handler(
        raw ? message : payload,
        actions,
        message.type
      )
      if (!actions.processed) {
        debug(
          'message is not processed, returning promise value with success status'
        )
        return await actions.success(result)
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
          payload,
          err
        )
        return await actions.error(err)
      }
    }
  }
}
