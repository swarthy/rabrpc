const RabRPCRespondError = require('../../errors/RabRPCRespondError')
const optionsFormat = require('./optionsFormat')

function checkProcessed() {
  if (this.processed) {
    throw new RabRPCRespondError(
      `"${this.message.type}" Message already processed`
    )
  }
  this.processed = true
}

function success(data, options = {}) {
  checkProcessed.call(this)
  return this.message.reply(data, optionsFormat.success(data, options))
}

function error(error, options = {}) {
  checkProcessed.call(this)
  return this.message.reply(null, optionsFormat.error(error, options))
}

function progress(data, options = {}) {
  options.more = true
  return this.message.reply(data, options)
}

module.exports = {
  success,
  error,
  progress
}
