const uuid = require('uuid')

const randomName = channelName => `pub-sub.${channelName}.${uuid.v4()}`

module.exports = function parseQueue(configItem) {
  const name = randomName(configItem.serviceName) // pub-sub.serviceName
  const queue = Object.assign({}, configItem, {
    name,
    autoDelete: true,
    durable: false,
    subscribe: true
  })
  delete queue.serviceName
  return queue
}
