const rabbot = require('rabbot')
const RabRPCError = require('../errors/RabRPCError')

function verifyExchange(exchangeName, connectionName) {
  if (!rabbot.getExchange(exchangeName, connectionName)) {
    throw new RabRPCError(`Exchange with name '${exchangeName}' does not exist`)
  }
}

function parseMessageType(prefix, messageType, connectionName) {
  const serviceName = messageType.split('.')[1] // v1.serviceName
  const exchangeName = `${prefix}.${serviceName}`
  module.exports.verifyExchange(exchangeName, connectionName) // need for mocking
  return { exchangeName, serviceName }
}

function getContentType(data) {
  if (Array.isArray(data)) {
    return 'application/json'
  } else if (data === null) {
    return 'application/null'
  } else if (typeof data === 'number' && Number.isFinite(data)) {
    return 'application/number'
  }
}

module.exports = {
  verifyExchange,
  parseMessageType,
  getContentType
}
