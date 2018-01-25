const rabbot = require('rabbot')

const makeHandler = require('./makeHandler')

module.exports = function respond(messageType, handler, raw = false) {
  return rabbot.handle(messageType, makeHandler(handler, raw))
}
