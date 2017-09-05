module.exports = function parseExchange(configItem, merge = false) {
  const name = `send-recv.${configItem.serviceName}`
  const required = {
    name, // send-recv.serviceName
    type: 'direct'
  }
  const defaults = {}
  let exchange
  if (merge) {
    exchange = Object.assign(defaults, configItem, required)
    delete exchange.serviceName
  } else {
    exchange = Object.assign(defaults, required)
  }
  return exchange
}
