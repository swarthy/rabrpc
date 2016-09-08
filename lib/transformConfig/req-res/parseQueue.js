module.exports = function parseQueue (config) {
  const name = `req-res.${config.serviceName}`
  const queue = Object.assign({
    name,                     // req-res.serviceName
    subscribe: true
  }, config)
  delete queue.serviceName
  return queue
}
