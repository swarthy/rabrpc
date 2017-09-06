const { getContentType } = require('../../utils')

function success(data, options) {
  if (!options.headers) {
    options.headers = {}
  }
  const contentType = getContentType(data)
  if (contentType) {
    options.contentType = contentType
  }
  options.headers.status = 'success'
  return options
}

function error(err, options) {
  if (!options.headers) {
    options.headers = {}
  }

  const message =
    typeof err === 'string' ? err : (err && err.message) || 'Unhandled error'
  const code = (err && err.code) || 500

  options.headers.status = 'error'
  options.headers.message = message
  options.headers.code = code
  options.contentType = 'application/json'

  return options
}

module.exports = {
  success,
  error
}
