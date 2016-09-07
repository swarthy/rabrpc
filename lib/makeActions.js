module.exports = function makeActions (message) {
  return {
    ack () { message.ack() },
    nack () { message.nack() },
    reject () { message.reject() }
  }
}
