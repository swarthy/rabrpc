module.exports = function parseExchange(configItem, merge = false) {
  const name = `pub-sub.${configItem.serviceName}`
  let exchange = {
    name, // pub-sub.serviceName
    type: 'fanout'
  }
  if (merge) {
    exchange = Object.assign({}, configItem, exchange)
    delete exchange.serviceName
  }
  return exchange
}
