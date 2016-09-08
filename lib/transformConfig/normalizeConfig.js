module.exports = function normalizeConfig (config) {
  const result = typeof config === 'string' ? {serviceName: config} : config
  if (!result.serviceName) {
    throw new Error('serviceName is required')
  }
  return result
}
