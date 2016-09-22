const rabbot = require('rabbot')
const transformConfig = require('./lib/transformConfig')

const request = require('./lib/request')
const respond = require('./lib/respond')

const send = require('./lib/send')
const receive = require('./lib/receive')

const publish = require('./lib/pub')
const subscribe = require('./lib/sub')

const RabRPC = {
  configure (config, transform = true) {
    return rabbot.configure(transform ? transformConfig(config) : config)
  },
  closeAll (reset) {
    return rabbot.closeAll(reset)
  },
  shutdown () {
    return rabbot.shutdown()
  },
  request,
  respond,
  send,
  receive,
  publish,
  subscribe
}

module.exports = RabRPC
