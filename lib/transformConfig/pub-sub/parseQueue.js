const uuid = require('uuid')

const randomName = channelName => `pub-sub.${channelName}.${uuid.v4()}`

module.exports = function parseQueue (config) {
  const queue = Object.assign({
    name: randomName(config.serviceName),     // pub-sub.serviceName
    autoDelete: true,
    durable: false,
    subscribe: true
  }, config)
  delete queue.serviceName
  return queue
}
