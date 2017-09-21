const actions = require('./actions')

module.exports = function makeResponseActions(rabrpc, message) {
  return {
    rabrpc,
    message,
    processed: false,
    success: actions.success,
    error: actions.error,
    progress: actions.progress
  }
}
