const Promise = require('bluebird')

const makeResponseActions = require('./makeResponseActions')

module.exports = function makeHandler (handler) {
  return message => {
    const actions = makeResponseActions(message)
    return Promise.resolve().then(() => handler(message.body.payload, actions, message.type))
    .then(result => {
      if (!actions.processed) {
        return actions.success(result)
      }
    })
    .catch(err => {
      if (actions.processed) {
        throw err // something goes wrong
      } else {
        return actions.error(err) // catch error
      }
    })
  }
}
