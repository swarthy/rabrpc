module.exports = function makeActions (message) {
  return {
    ack () { return message.ack() },
    nack () { return message.nack() },
    reject () { return message.reject() }
  }
}
