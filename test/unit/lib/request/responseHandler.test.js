const responseHandler = require('../../../../lib/request/responseHandler')

const message = {
  body: {
    status: 'success',
    data: 42
  }
}

describe('responseHandler', () => {
  it('should transform message to array', () => {
    expect(responseHandler(message)).to.be.instanceof(Array)
  })
  it('should transform message to array of body and actions', () => {
    const [body, actions] = responseHandler(message)
    expect(body).to.be.eql({status: 'success', data: 42})
    expect(actions).to.have.all.keys('ack', 'nack', 'reject')
  })
})
