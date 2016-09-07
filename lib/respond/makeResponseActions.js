const jsend = require('jsend')

module.exports = function makeResponseActions (message) {
  return {
    success (data) { return message.reply(jsend.success(data)) },
    fail (data) { return message.reply(jsend.fail(data)) },
    error (msg) { return message.reply(jsend.error(msg)) }
  }
}
