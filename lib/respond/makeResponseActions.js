const jsend = require('jsend')

module.exports = function makeResponseActions (message) {
  function reply (data) {
    this.processed = true
    return message.reply(data)
  }
  return {
    success (data) { return reply(jsend.success(data !== undefined ? data : null)) },
    fail (data) { return reply(jsend.fail(data !== undefined ? data : null)) },
    error (msg) { return reply(jsend.error(msg !== undefined ? msg : {code: 500, message: 'UNHANDLED ERROR'})) }
  }
}
