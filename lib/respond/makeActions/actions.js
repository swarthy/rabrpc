const RabRPCRespondError = require('../../errors/RabRPCRespondError')
const optionsFormat = require('./optionsFormat')

function checkProcessed(actions) {
  if (actions.processed) {
    throw new RabRPCRespondError(
      `[RabRPC.Respond] "${actions.message.type}" Message already processed`
    )
  }
  actions.processed = true
}

function success(data, options = {}) {
  checkProcessed(this)
  if (typeof data === 'undefined') {
    throw new RabRPCRespondError(
      '[RabRPC.Respond] Response can not be undefined'
    )
  }
  return this.message.reply(data, optionsFormat.success(data, options))
}

function error(error, options = {}) {
  checkProcessed(this)
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
