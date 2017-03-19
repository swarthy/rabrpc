const RabRPCError = require('../errors/RabRPCError')

module.exports = function normalizeConfig (config) {
  const result = typeof config === 'string' ? {serviceName: config} : config
  if (!result.serviceName) {
    throw new RabRPCError('serviceName is required')
  }
  return result
}
