const RabRPCReceiveError = require('../errors/RabRPCReceiveError')

function ack() {
  if (this.processed) {
    throw new RabRPCReceiveError(
      `[RabRPC Receive"${this.message.type}" Message already processed`
    )
  }
  this.processed = true
  this.message.ack()
}

function nack() {
  if (this.processed) {
    throw new RabRPCReceiveError(
      `"${this.message.type}" Message already processed`
    )
  }
  this.processed = true
  this.message.nack()
}

function reject() {
  if (this.processed) {
    throw new RabRPCReceiveError(
      `"${this.message.type}" Message already processed`
    )
  }
  this.processed = true
  this.message.reject()
}

module.exports = function makeActions(message) {
  return {
    message,
    processed: false,
    ack,
    nack,
    reject
  }
}
