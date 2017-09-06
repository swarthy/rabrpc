const nullSerializer = require('./nullSerializer')
const numberSerializer = require('./numberSerializer')

function initialize(rabbot) {
  rabbot.addSerializer('application/null', nullSerializer)
  rabbot.addSerializer('application/number', numberSerializer)
}

module.exports = initialize
