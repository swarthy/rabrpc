module.exports = function parseExchange (configItem, merge = false) {
  const name = `req-res.${configItem.serviceName}`
  const required = {
    name,                     // req-res.serviceName
    type: 'direct'
  }
  const defaults = {replyTimeout: 10000}
  let exchange
  if (merge) {
    exchange = Object.assign(defaults, configItem, required)
    delete exchange.serviceName
  } else {
    exchange = Object.assign(defaults, required)
  }
  return exchange
}
