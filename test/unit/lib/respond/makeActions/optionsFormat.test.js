const optionsFormat = require('../../../../../lib/respond/makeActions/optionsFormat')

describe('respond makeActions format', () => {
  it('success', () => {
    expect(optionsFormat.success({}, {})).to.be.eql({
      headers: {
        status: 'success'
      }
    })
  })
  it('error', () => {
    expect(optionsFormat.error(null, {})).to.be.eql({
      contentType: 'application/json',
      headers: {
        status: 'error',
        code: 500,
        message: 'Unhandled error'
      }
    })
    expect(optionsFormat.error(undefined, {})).to.be.eql({
      contentType: 'application/json',
      headers: {
        status: 'error',
        code: 500,
        message: 'Unhandled error'
      }
    })
    expect(optionsFormat.error('text error', {})).to.be.eql({
      contentType: 'application/json',
      headers: {
        status: 'error',
        code: 500,
        message: 'text error'
      }
    })
    const errorWithoutCode = new Error('Some error without code')
    const errorWithCode = new Error('Some error with code')
    errorWithCode.code = 444
    expect(optionsFormat.error(errorWithoutCode, {})).to.be.eql({
      contentType: 'application/json',
      headers: {
        status: 'error',
        code: 500,
        message: 'Some error without code'
      }
    })
    expect(optionsFormat.error(errorWithCode, {})).to.be.eql({
      contentType: 'application/json',
      headers: {
        status: 'error',
        code: 444,
        message: 'Some error with code'
      }
    })
  })
})
