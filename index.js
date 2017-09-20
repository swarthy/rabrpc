const rabbot = require('rabbot')
const transformConfig = require('./lib/transformConfig')

const errors = require('./lib/errors')
const RabRPCError = require('./lib/errors/RabRPCError')

const debug = require('debug')('rabrpc')

const addSerializers = require('./lib/serializers')
addSerializers(rabbot)

const request = require('./lib/request')
const respond = require('./lib/respond')

const send = require('./lib/send')
const receive = require('./lib/receive')

const publish = require('./lib/pub')
const subscribe = require('./lib/sub')

class RabRPC {
  constructor() {
    this.request = request
    this.respond = respond
    this.send = send
    this.receive = receive
    this.publish = publish
    this.subscribe = subscribe
    this.initialized = false
  }
  async configure(config, transform = true) {
    debug('rabrpc config: %j', config)
    const rabbotConfig = transform ? transformConfig(config) : config
    debug('rabbot config: %j', rabbotConfig)
    try {
      await rabbot.configure(rabbotConfig)
      this.initialized = true
    } catch (error) {
      this.initialized = false
      debug('initialization error:', error)
      if (typeof error === 'string') {
        throw new RabRPCError(error)
      } else {
        throw error
      }
    }
  }
  async closeAll(reset) {
    if (this.initialized) {
      debug('closeAll: rabrpc was initialized, call rabbot.closeAll')
      this.initialized = false
      return await rabbot.closeAll(reset)
    }
    debug('closeAll: rabrpc was NOT initialized, skip')
  }
  async shutdown() {
    if (this.initialized) {
      debug('shutdown: rabrpc was initialized, call rabbot.shutdown')
      this.initialized = false
      await rabbot.shutdown()
      await rabbot.reset()
    }
    debug('shutdown: rabrpc was NOT initialized, skip')
  }
}

const rabrpc = new RabRPC()

module.exports = rabrpc
module.exports.errors = errors
