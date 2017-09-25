function parsePayload(message) {
  const protocol = message.properties.headers.protocol
  switch (protocol) {
    case 1:
      return message.body
    default: {
      return message.body.payload
    }
  }
}

module.exports = parsePayload
