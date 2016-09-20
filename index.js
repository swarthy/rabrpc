const rabbot = require('rabbot')
const transformConfig = require('./lib/transformConfig')

const request = require('./lib/request')
const respond = require('./lib/respond')

const send = require('./lib/send')
const receive = require('./lib/receive')

const RabRPC = {
  initialize (config, transform = true) {
    if (RabRPC.initialized) {
      throw new Error('[RabRPC] Already initialized')
    }
    RabRPC.initialized = true
    return rabbot.configure(transform ? transformConfig(config) : config)
    .catch(err => {
      console.error('[RabRPC] Initialing error:', err)
      throw err
    })
  },
  shutdown () {
    RabRPC.initialized = false
    return rabbot.shutdown()
  },
  request,
  respond,
  send,
  receive
}

module.exports = RabRPC
