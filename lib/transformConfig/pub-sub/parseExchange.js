module.exports = function parseExchange (config, merge = false) {
  const name = `pub-sub.${config.serviceName}`
  let exchange = {
    name,                              // pub-sub.serviceName
    type: 'fanout',
    replyTimeout: 10000
  }
  if (merge) {
    exchange = Object.assign(exchange, config)
    delete exchange.serviceName
  }
  return exchange
}
