const actions = require('./actions')

module.exports = function makeResponseActions(message) {
  return {
    message,
    processed: false,
    success: actions.success,
    error: actions.error,
    progress: actions.progress
  }
}
