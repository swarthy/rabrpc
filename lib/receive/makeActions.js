const RabRPCReceiveError = require('../errors/RabRPCReceiveError')

module.exports = function makeActions(message) {
  return {
    processed: false,
    ack() {
      if (this.processed) {
        throw new RabRPCReceiveError(
          `[RabRPC Receive"${message.type}" Message already processed`
        )
      }
      this.processed = true
      message.ack()
    },
    nack() {
      if (this.processed) {
        throw new RabRPCReceiveError(
          `"${message.type}" Message already processed`
        )
      }
      this.processed = true
      message.nack()
    },
    reject() {
      if (this.processed) {
        throw new RabRPCReceiveError(
          `"${message.type}" Message already processed`
        )
      }
      this.processed = true
      message.reject()
    }
  }
}
