const jsend = require('jsend')

module.exports = function makeResponseActions (message) {
  return {
    success (data) { message.reply(jsend.success(data)) },
    fail (data) { message.reply(jsend.fail(data)) },
    error (msg) { message.reply(jsend.error(msg)) }
  }
}
