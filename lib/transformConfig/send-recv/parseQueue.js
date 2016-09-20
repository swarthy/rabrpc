module.exports = function parseQueue (config) {
  const name = `send-recv.${config.serviceName}`
  const queue = Object.assign({
    name,                     // send-recv.serviceName
    subscribe: true
  }, config)
  delete queue.serviceName
  return queue
}
