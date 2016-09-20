const Promise = require('bluebird')

const makeActions = require('./makeActions')

module.exports = function makeReceiveHandler (handler) {
  return message => {
    const actions = makeActions(message)
    return Promise.resolve().then(() => handler(message.body.payload, actions, message.type))
    .then(result => {
      if (!actions.processed) {
        return message.ack()
      }
    })
    .catch(err => {
      if (actions.processed) {
        throw err // something goes wrong
      } else {
        return message.nack()
      }
    })
  }
}
