const rabbot = require('rabbot')
const RabRPCError = require('../errors/RabRPCError')

module.exports = {
  verifyExchange(exchangeName, connectionName) {
    if (!rabbot.getExchange(exchangeName, connectionName)) {
      throw new RabRPCError(
        `Exchange with name '${exchangeName}' does not exist`
      )
    }
  },
  parseMessageType(prefix, messageType, connectionName) {
    const serviceName = messageType.split('.')[1] // v1.serviceName
    const exchangeName = `${prefix}.${serviceName}`
    module.exports.verifyExchange(exchangeName, connectionName)
    return { exchangeName, serviceName }
  }
}
