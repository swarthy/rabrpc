const responseHandler = require('../../../../lib/request/responseHandler')

const sinon = require('sinon')

describe('request responseHandler', () => {
  let message
  beforeEach(() => {
    message = {
      body: {
        status: 'success',
        data: 42
      },
      ack: sinon.spy()
    }
  })
  it('should transform message to array', () => {
    expect(responseHandler(message)).to.be.eql({ status: 'success', data: 42 })
    expect(message.ack).to.have.been.calledOnce
  })
})
