const Transform = require('./transform')
const ReqRes = require('./req-res')
const SendRecv = require('./send-recv')

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
    toArray(config.req).forEach(item => Transform.transformProducer(cfg, item, ReqRes.parseExchange))
  }
  if (config.res) {
    toArray(config.res).forEach(item => Transform.transformConsumer(cfg, item, ReqRes.parseExchange, ReqRes.parseQueue))
  }
  if (config.send) {
    toArray(config.send).forEach(item => Transform.transformProducer(cfg, item, SendRecv.parseExchange))
  }
  if (config.recv) {
    toArray(config.recv).forEach(item => Transform.transformConsumer(cfg, item, SendRecv.parseExchange, SendRecv.parseQueue))
  }
  cfg.connection = typeof config.connection === 'string' ? {uri: config.connection} : config.connection
  return cfg
}
