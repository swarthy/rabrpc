const RabRPCReceiveError = require('../errors/RabRPCReceiveError')

function checkProcessed(actions) {
  if (actions.processed) {
    throw new RabRPCReceiveError(
      `[RabRPC.Receive] "${actions.message.type}" Message already processed`
    )
  }
  actions.processed = true
}

function ack() {
  checkProcessed(this)
  this.message.ack()
}

function nack() {
  checkProcessed(this)
  this.message.nack()
}

function reject() {
  checkProcessed(this)
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
