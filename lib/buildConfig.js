function normalizeConfig (config) {
  let result
  if (typeof config === 'string') {
    result = {serviceName: config}
  } else if (typeof config === 'object') {
    result = config
  }
  if (!result.serviceName) {
    throw new Error('serviceName is required')
  }
  return result
}

function parseExchange (config, merge = false) {
  const name = `req-res.${config.serviceName}`
  let exchange = {
    name,                     // req-res.serviceName
    type: 'direct',
    replyTimeout: 10000
  }
  if (merge && typeof config === 'object') {
    exchange = Object.assign(exchange, config)
    delete exchange.serviceName
  }
  return exchange
}

function parseQueue (config) {
  const name = `req-res.${config.serviceName}`
  let queue = {
    name,                     // req-res.serviceName
    subscribe: true
  }
  if (typeof config === 'object') {
    queue = Object.assign(queue, config)
    delete queue.serviceName
  }
  return queue
}

function buildReq (cfg, config) {
  const exchange = parseExchange(config, true)
  cfg.exchanges.push(exchange)
}

function buildRes (cfg, config) {
  const exchange = parseExchange(config)
  const queue = parseQueue(config)
  const serviceName = config.serviceName
  cfg.exchanges.push(exchange)
  cfg.queues.push(queue)
  cfg.bindings.push({
    exchange: exchange.name,  // req-res.serviceName
    target: queue.name,       // req-res.serviceName
    keys: serviceName         // serviceName
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
    arr.forEach(reqItem => buildReq(cfg, normalizeConfig(reqItem)))
  }
  if (config.res) {
    const arr = Array.isArray(config.res) ? config.res : [config.res]
    arr.forEach(resItem => buildRes(cfg, normalizeConfig(resItem)))
  }
  cfg.connection = typeof config.connection === 'string' ? {uri: config.connection} : config.connection
  return cfg
}
