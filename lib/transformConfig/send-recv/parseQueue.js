module.exports = function parseQueue (configItem) {
  const name = `send-recv.${configItem.serviceName}`
  const queue = Object.assign({}, configItem, {
    name,                     // send-recv.serviceName
    subscribe: true
  })
  delete queue.serviceName
  return queue
}
