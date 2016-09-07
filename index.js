const rabbot = require('rabbot')
const buildConfig = require('./lib/buildConfig')

const request = require('./lib/request')
const respond = require('./lib/respond')

module.exports = {
  initialize (config, build = true) {
    return rabbot.configure(build ? buildConfig(config) : config)
    .then(() => process.once('SIGINT', this.shutdown))
    .then(() => console.log('[RPC] Initialized'))
    .catch(err => {
      console.error('[RPC] Initialing error:', err)
      throw err
    })
  },
  shutdown () {
    return rabbot.shutdown()
  },
  request,
  respond
}
