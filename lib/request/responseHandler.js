module.exports = function responseHandler(message) {
  // auto ack response messsage
  message.ack() // rabbot does not return promise here, so...
  return message.body
}
