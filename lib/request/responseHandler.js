const makeActions = require('../makeActions')

module.exports = function responseHandler (message) {
  return [message.body, makeActions(message)]
}
