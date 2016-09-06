const rabbot = require('rabbot')
const buildConfig = require('./lib/buildConfig')
const jsend = require('jsend')

process.once('SIGINT', function () {
  exit()
})

process.on('unhandledException', function (err) {
  console.error(err)
  exit()
})

function exit () {
  shutdown().then(() => process.exit())
}

function shutdown () {
  console.log('[RPC] Shutting down ...')
  return rabbot.shutdown()
}

function makeResponseActions (message) {
  return {
    success (data) { message.reply(jsend.success(data)) },
    fail (data) { message.reply(jsend.fail(data)) },
    error (message) { message.reply(jsend.error(message)) }
  }
}

function makeActions (message) {
  return {
    ack () { message.ack() },
    nack () { message.nack() },
    reject () { message.reject() }
  }
}

module.exports = {
  initialize (config, build = true) {
    return rabbot.configure(build ? buildConfig(config) : config)
    .then(() => console.log('[RPC] Initialized'))
    .catch(err => {
      console.error('[RPC] Initialing error:', err)
      process.exit()
    })
  },
  shutdown () {
    return rabbot.shutdown()
  },
  request (messageType, payload, options) {
    const serviceName = messageType.split('.')[1] // v1.service-name.action.subaction
    const exchangeName = `req-res.${serviceName}`
    const exchange = rabbot.getExchange(exchangeName)
    if (!exchange) {
      throw new Error(`Exchange with name '${exchangeName}' does not exist`)
    }
    return rabbot.request(exchangeName, Object.assign({
      routingKey: serviceName,
      type: messageType,
      replyTimeout: 10000,
      body: {payload}
    }, options))
    .then(message => [message.body, makeActions(message)])
  },
  respond (messageType, handler) {
    return rabbot.handle(messageType, message => handler(message.body.payload, makeResponseActions(message)))
  }
}
