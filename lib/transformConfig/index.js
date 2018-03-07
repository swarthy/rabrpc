const RabRPCError = require('../errors/RabRPCError')

const Transform = require('./transform')
const ReqRes = require('./req-res')
const SendRecv = require('./send-recv')
const PubSub = require('./pub-sub')

function toArray(item) {
  return Array.isArray(item) ? item : [item]
}

module.exports = function transformConfig(config) {
  if (!config) {
    throw new RabRPCError('config is required')
  }
  const cfg = { exchanges: [], queues: [], bindings: [] }
  if (!config.connection) {
    throw new RabRPCError('connection option is required')
  }
  if (config.req) {
    toArray(config.req).forEach(item =>
      Transform.transformProducer(cfg, item, ReqRes.parseExchange)
    )
  }
  if (config.res) {
    toArray(config.res).forEach(item =>
      Transform.transformConsumer(
        cfg,
        item,
        ReqRes.parseExchange,
        ReqRes.parseQueue
      )
    )
  }
  if (config.send) {
    toArray(config.send).forEach(item =>
      Transform.transformProducer(cfg, item, SendRecv.parseExchange)
    )
  }
  if (config.recv) {
    toArray(config.recv).forEach(item =>
      Transform.transformConsumer(
        cfg,
        item,
        SendRecv.parseExchange,
        SendRecv.parseQueue
      )
    )
  }
  if (config.pub) {
    toArray(config.pub).forEach(item =>
      Transform.transformProducer(cfg, item, PubSub.parseExchange)
    )
  }
  if (config.sub) {
    toArray(config.sub).forEach(item =>
      Transform.transformConsumer(
        cfg,
        item,
        PubSub.parseExchange,
        PubSub.parseQueue
      )
    )
  }
  cfg.connection =
    typeof config.connection === 'string'
      ? { uri: config.connection }
      : config.connection
  if (cfg.connection.name) {
    cfg.name = cfg.connection.name
  }
  if (!config.req) {
    cfg.connection.replyQueue = false
  }
  return cfg
}
