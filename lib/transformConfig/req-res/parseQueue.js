module.exports = function parseQueue(configItem) {
  const name = `req-res.${configItem.serviceName}`
  const queue = Object.assign({}, configItem, {
    name, // req-res.serviceName
    subscribe: true
  })
  delete queue.serviceName
  return queue
}
