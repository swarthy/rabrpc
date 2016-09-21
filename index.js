const rabbot = require('rabbot')
const transformConfig = require('./lib/transformConfig')

const request = require('./lib/request')
const respond = require('./lib/respond')

const send = require('./lib/send')
const receive = require('./lib/receive')

const RabRPC = {
  configure (config, transform = true) {
    return rabbot.configure(transform ? transformConfig(config) : config)
    .catch(err => {
      console.error('[RabRPC] Configuring error:', err)
      throw err
    })
  },
  shutdown () {
    return rabbot.shutdown()
  },
  request,
  respond,
  send,
  receive
}

module.exports = RabRPC
