const makeResponseActions = require('./makeResponseActions')

module.exports = function makeHandler (handler) {
  return message => handler(message.body.payload, makeResponseActions(message))
}
