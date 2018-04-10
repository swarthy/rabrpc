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

async function configure(config, transform = true) {
  debug('configuring')
  debug('rabrpc config: %j', config)
  const rabbotConfig = transform ? transformConfig(config) : config
  debug('rabbot config: %j', rabbotConfig)
  return await rabbot.configure(rabbotConfig)
}

async function shutdown() {
  debug('shutdown')
  await rabbot.shutdown()
  await rabbot.reset()
  removeHandlers()
}

async function stopSubscription() {
  debug('stopSubscription')
  const configNames = Object.keys(rabbot.configurations)
  configNames.forEach(configName => {
    const config = rabbot.configurations[configName]
    config.queues.forEach(queue => {
      debug(
        'stopSubscription config: "%s", queue: "%s"',
        configName,
        queue.name
      )
      const connectionName = config.connection.name
      rabbot.stopSubscription(queue.name, connectionName)
    })
  })
  removeHandlers()
}

function removeHandlers() {
  debug('removeHandlers')
  let sub
  while ((sub = subscriptions.pop())) {
    debug('remove handler', sub)
    sub.remove()
  }
}

const subscriptions = []

const RabRPC = {
  errors,

  configure,
  stopSubscription,
  removeHandlers,
  shutdown,

  request,
  respond() {
    const sub = respond.apply(this, arguments)
    subscriptions.push(sub)
    return sub
  },
  send,
  receive() {
    const sub = receive.apply(this, arguments)
    subscriptions.push(sub)
    return sub
  },
  publish,
  subscribe() {
    const sub = subscribe.apply(this, arguments)
    subscriptions.push(sub)
    return sub
  }
}

module.exports = RabRPC
