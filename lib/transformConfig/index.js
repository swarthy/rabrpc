const ReqRes = require('./req-res')

function toArray (item) {
  return Array.isArray(item) ? item : [item]
}

module.exports = function transformConfig (config) {
  if (!config) {
    throw new Error('config is required')
  }
  const cfg = {exchanges: [], queues: [], bindings: []}
  if (!config.connection) {
    throw new Error('connection option is required')
  }
  if (config.req) {
    toArray(config.req).forEach(item => ReqRes.transformReq(cfg, item))
  }
  if (config.res) {
    toArray(config.res).forEach(item => ReqRes.transformRes(cfg, item))
  }
  cfg.connection = typeof config.connection === 'string' ? {uri: config.connection} : config.connection
  return cfg
}
