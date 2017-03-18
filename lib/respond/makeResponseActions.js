const jsend = require('jsend')

module.exports = function makeResponseActions (message) {
  function reply (data) {
    if (this.processed) {
      throw new Error(`"${message.type}" Message already processed`)
    }
    this.processed = true
    return message.reply(data)
  }
  return {
    processed: false,
    success (data) { return reply(jsend.success(data !== undefined ? data : null)) },
    fail (data) { return reply(jsend.fail(data !== undefined ? data : null)) },
    error (msg) { return reply(jsend.error(msg !== undefined ? msg : {code: 500, message: 'UNHANDLED ERROR'})) }
  }
}
