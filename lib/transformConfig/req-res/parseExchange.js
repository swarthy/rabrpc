module.exports = function parseExchange (config, merge = false) {
  const name = `req-res.${config.serviceName}`
  let exchange = {
    name,                     // req-res.serviceName
    type: 'direct',
    replyTimeout: 10000
  }
  if (merge) {
    exchange = Object.assign(exchange, config)
    delete exchange.serviceName
  }
  return exchange
}
