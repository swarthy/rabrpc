const RabRPCReceiveError = require('../errors/RabRPCReceiveError')

function checkProcessed() {
  if (this.processed) {
    throw new RabRPCReceiveError(
      `[RabRPC.Receive] "${this.message.type}" Message already processed`
    )
  }
  this.processed = true
}

function ack() {
  checkProcessed.call(this)
  this.message.ack()
}

function nack() {
  checkProcessed.call(this)
  this.message.nack()
}

function reject() {
  checkProcessed.call(this)
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
