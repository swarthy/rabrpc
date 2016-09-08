const rabbot = require('rabbot')
const transformConfig = require('./lib/transformConfig')

const request = require('./lib/request')
const respond = require('./lib/respond')

module.exports = {
  initialize (config, transform = true) {
    return rabbot.configure(transform ? transformConfig(config) : config)
    .then(() => process.once('SIGINT', this.shutdown))
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
