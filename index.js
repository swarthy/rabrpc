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

const publish = require('./lib/publish')
const subscribe = require('./lib/subscribe')

function onUnreachable() {
  throw new RabRPCError(
    'Connection failures have reached the limit, no further attempts will be made'
  )
}

rabbot.on('unreachable', onUnreachable)

function configure(config, transform = true) {
  debug('configuring')
  debug('rabrpc config: %j', config)
  const rabbotConfig = transform ? transformConfig(config) : config
  debug('rabbot config: %j', rabbotConfig)
  return rabbot.configure(rabbotConfig)
}

async function shutdown() {
  debug('shutdown')
  await rabbot.shutdown()
  await rabbot.reset()
}

const RabRPC = {
  errors,

  configure,
  shutdown,

  request,
  respond,
  send,
  receive,
  publish,
  subscribe
}

module.exports = RabRPC
