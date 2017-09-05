const RabRPCRespondError = require('../../errors/RabRPCRespondError')

module.exports = function makeReplyAction(message, dataFormatter) {
  return function respondAction(data, options) {
    if (this.processed) {
      throw new RabRPCRespondError(
        `"${message.type}" Message already processed`
      )
    }
    this.processed = true
    return message.reply(dataFormatter(data), options)
  }
}
