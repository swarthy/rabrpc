const Promise = require('bluebird')
const rabbot = require('rabbot')
const transformConfig = require('./lib/transformConfig')
const errors = require('./lib/errors')

const debug = require('debug')('rabrpc')

const request = require('./lib/request')
const respond = require('./lib/respond')

const send = require('./lib/send')
const receive = require('./lib/receive')

const publish = require('./lib/pub')
const subscribe = require('./lib/sub')

const RabRPC = {
  configure (config, transform = true) {
    debug('rabrpc config: %j', config)
    const rabbotConfig = transform ? transformConfig(config) : config
    debug('rabbot config: %j', rabbotConfig)
    return Promise.resolve(rabbot.configure(rabbotConfig))
    .tap(() => { this.initialized = true })
    .catch(error => {
      this.initialized = false
      debug('initialization error:', error)
      if (typeof error === 'string') {
        throw new errors.RabRPCError(error)
      } else {
        throw error
      }
    })
  },
  closeAll (reset) {
    if (this.initialized) {
      debug('closeAll: rabrpc was initialized, call rabbot.closeAll')
      this.initialized = false
      return rabbot.closeAll(reset)
    }
    debug('closeAll: rabrpc was NOT initialized, skip')
    return Promise.resolve()
  },
  shutdown () {
    if (this.initialized) {
      debug('shutdown: rabrpc was initialized, call rabbot.shutdown')
      this.initialized = false
      return rabbot.shutdown()
    }
    debug('shutdown: rabrpc was NOT initialized, skip')
    return Promise.resolve()
  },
  request,
  respond,
  send,
  receive,
  publish,
  subscribe
}

module.exports = RabRPC
module.exports.errors = errors
