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
  if (!this.rabrpc.initialized) {
    return
  }
  this.message.ack()
}

function nack() {
  checkProcessed.call(this)
  if (!this.rabrpc.initialized) {
    return
  }
  this.message.nack()
}

function reject() {
  checkProcessed.call(this)
  if (!this.rabrpc.initialized) {
    return
  }
  this.message.reject()
}

module.exports = function makeActions(rabrpc, message) {
  return {
    rabrpc,
    message,
    processed: false,
    ack,
    nack,
    reject
  }
}
