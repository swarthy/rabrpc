module.exports = function parseExchange (config, merge = false) {
  const name = `send-recv.${config.serviceName}`
  let exchange = {
    name,                     // send-recv.serviceName
    type: 'direct',
    replyTimeout: 10000
  }
  if (merge) {
    exchange = Object.assign(exchange, config)
    delete exchange.serviceName
  }
  return exchange
}
