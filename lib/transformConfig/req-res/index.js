const parseExchange = require('./parseExchange')
const parseQueue = require('./parseQueue')

const normalizeConfig = require('../normalizeConfig')

module.exports = {
  transformReq (cfg, config) {
    config = normalizeConfig(config)
    const exchange = parseExchange(config, true)
    cfg.exchanges.push(exchange)
  },
  transformRes (cfg, config) {
    config = normalizeConfig(config)
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
}
