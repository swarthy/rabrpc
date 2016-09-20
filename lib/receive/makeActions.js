module.exports = function makeActions (message) {
  return {
    ack () {
      this.processed = true
      message.ack()
    },
    nack () {
      this.processed = true
      message.nack()
    },
    reject () {
      this.processed = true
      message.reject()
    }
  }
}
