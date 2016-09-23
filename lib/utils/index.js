const rabbot = require('rabbot')

module.exports = {
  verifyExchange (exchangeName) {
    if (!rabbot.getExchange(exchangeName)) {
      throw new Error(`Exchange with name '${exchangeName}' does not exist`)
    }
  },
  parseMessageType (prefix, messageType) {
    const serviceName = messageType.split('.')[1] // v1.serviceName
    const exchangeName = `${prefix}.${serviceName}`
    module.exports.verifyExchange(exchangeName)
    return {exchangeName, serviceName}
  }
}
