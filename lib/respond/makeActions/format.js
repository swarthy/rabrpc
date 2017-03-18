const jsend = require('jsend')

function success (data) {
  return jsend.success(data !== undefined ? data : null)
}

function fail (data) {
  return jsend.fail(data !== undefined ? data : null)
}

function error (msg) {
  return jsend.error(msg !== undefined ? msg : {code: 500, message: 'UNHANDLED ERROR'})
}

module.exports = {
  success, fail, error
}
