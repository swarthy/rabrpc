const nullSerializer = require('./nullSerializer')
const numberSerializer = require('./numberSerializer')

function addSerializers(rabbot) {
  rabbot.addSerializer('application/null', nullSerializer)
  rabbot.addSerializer('application/number', numberSerializer)
}

module.exports = addSerializers
