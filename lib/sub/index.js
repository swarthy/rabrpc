const rabbot = require('rabbot')

const makeHandler = require('./makeHandler')

module.exports = function subscribe (messageType, handler) {
  return rabbot.handle(messageType, makeHandler(handler))
}
