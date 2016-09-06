const rabbot = require('rabbot')

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
