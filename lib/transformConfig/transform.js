const normalizeConfig = require('./normalizeConfig')
module.exports = {
  transformProducer (cfg, config, parseExchange) {
    config = normalizeConfig(config)
    const exchange = parseExchange(config, true)
    cfg.exchanges.push(exchange)
  },
  transformConsumer (cfg, config, parseExchange, parseQueue) {
    config = normalizeConfig(config)
    const exchange = parseExchange(config)
    const queue = parseQueue(config)
    const serviceName = config.serviceName
    cfg.exchanges.push(exchange)
    cfg.queues.push(queue)
    cfg.bindings.push({
      exchange: exchange.name,
      target: queue.name,
      keys: serviceName
    })
  }
}
