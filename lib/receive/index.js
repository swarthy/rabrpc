const rabbot = require('rabbot')

const makeHandler = require('./makeHandler')

module.exports = function receive (messageType, handler) {
  return rabbot.handle(messageType, makeHandler(handler))
}
