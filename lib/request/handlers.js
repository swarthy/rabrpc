const RabRPCRequestError = require('../errors/RabRPCRequestError')

function processReplyMessage(message) {
  // auto ack response messsage
  message.ack() // rabbot does not return promise here, so...
  if (message.properties.headers.status === 'error') {
    const error = new RabRPCRequestError(message.properties.headers.message)
    if (message.properties.headers.code) {
      error.code = message.properties.headers.code
    }
    error.replyMessage = message
    throw error
  }
}

function bodyResponseHandler(message) {
  processReplyMessage(message)
  return message.body
}

function messageResponseHandler(message) {
  processReplyMessage(message)
  return message
}

module.exports = {
  bodyResponseHandler,
  messageResponseHandler
}
