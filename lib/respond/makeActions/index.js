const makeReplyAction = require('./makeReplyAction')
const format = require('./format')

module.exports = function makeResponseActions (message) {
  return {
    processed: false,
    success: makeReplyAction(message, format.success),
    fail: makeReplyAction(message, format.fail),
    error: makeReplyAction(message, format.error),
    progress (data, options) {
      if (!options) {
        options = {}
      }
      options.more = true
      return message.reply(data, options)
    }
  }
}
