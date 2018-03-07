const {
  bodyResponseHandler,
  messageResponseHandler
} = require('../../../../lib/request/handlers')

const sinon = require('sinon')

describe('request handlers', () => {
  const message = {
    properties: {
      headers: {
        status: 'success'
      }
    },
    body: 'response payload',
    ack: sinon.spy()
  }
  let errorMessage = {
    properties: {
      headers: {
        status: 'error',
        message: 'error message'
      }
    },
    body: undefined,
    ack: sinon.spy()
  }
  beforeEach(() => {
    message.ack.resetHistory()
    errorMessage.ack.resetHistory()
  })
  describe('bodyResponseHandler', () => {
    it('should return message body', () => {
      expect(bodyResponseHandler(message)).to.be.eql('response payload')
      expect(message.ack).to.have.been.calledOnce
    })
    it('should throw error if message is error', () => {
      expect(() => bodyResponseHandler(errorMessage)).to.throw(/error message/)
    })
  })
  describe('messageResponseHandler', () => {
    it('should return message', () => {
      expect(messageResponseHandler(message)).to.be.equal(message)
      expect(message.ack).to.have.been.calledOnce
    })
    it('should throw error if message is error', () => {
      expect(() => messageResponseHandler(errorMessage)).to.throw(
        /error message/
      )
    })
  })
})
