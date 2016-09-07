function getName (config) {
  const name = typeof config === 'string' ? config : config.serviceName
  if (!name) {
    throw new Error('serviceName is required')
  }
  return name
}

function buildReq (cfg, config) {
  const name = `req-res.${getName(config)}`
  const exchange = {
    name,                    // req-res.serviceName
    type: 'direct'
  }
  cfg.exchanges.push(exchange)
  return exchange
}

function buildRes (cfg, config) {
  const exchange = buildReq(cfg, config)
  const serviceName = getName(config)
  delete config.serviceName
  const name = `req-res.${serviceName}`
  const queue = Object.assign({name, subscribe: true}, typeof config === 'object' ? config : null)
  cfg.queues.push(queue)
  cfg.bindings.push({
    exchange: exchange.name, // req-res.serviceName
    target: queue.name,      // req-res.serviceName
    keys: serviceName        // serviceName
  })
}

module.exports = function buildConfig (config) {
  if (!config) {
    throw new Error('config is required')
  }
  const cfg = {exchanges: [], queues: [], bindings: []}
  if (!config.connection) {
    throw new Error('connection option is required')
  }
  if (config.req) {
    const arr = Array.isArray(config.req) ? config.req : [config.req]
    arr.forEach(req => buildReq(cfg, req))
  }
  if (config.res) {
    const arr = Array.isArray(config.res) ? config.res : [config.res]
    arr.forEach(res => buildRes(cfg, res))
  }
  cfg.connection = typeof config.connection === 'string' ? {uri: config.connection} : config.connection
  return cfg
}
