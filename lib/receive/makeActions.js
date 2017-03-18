module.exports = function makeActions (message) {
  return {
    processed: false,
    ack () {
      if (this.processed) {
        throw new Error(`"${message.type}" Message already processed`)
      }
      this.processed = true
      message.ack()
    },
    nack () {
      if (this.processed) {
        throw new Error(`"${message.type}" Message already processed`)
      }
      this.processed = true
      message.nack()
    },
    reject () {
      if (this.processed) {
        throw new Error(`"${message.type}" Message already processed`)
      }
      this.processed = true
      message.reject()
    }
  }
}
