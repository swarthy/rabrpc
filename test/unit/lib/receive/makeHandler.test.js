const sinon = require('sinon')

const makeHandler = require('../../../../lib/receive/makeHandler')

const message = {
  type: 'messageType',
  body: {
    payload: 42
  },
  ack: sinon.spy(),
  nack: sinon.spy()
}

describe('receive makeHandler', () => {
  let userHandler
  let handler
  beforeEach(() => {
    userHandler = sinon.stub().returns(137)
    message.ack.reset()
    message.nack.reset()
    handler = makeHandler(userHandler)
  })
  it('should return user-friendly handler', () => {
    expect(handler).to.be.fn
  })
  it('should return handler which call userHandler with payload and actions', () => {
    return handler(message).then(() => {
      expect(userHandler).to.have.been.calledWithMatch(42, {}, 'messageType') // actions object
      expect(message.ack).to.have.been.called
      expect(message.nack).to.have.not.been.called
    })
  })
  it('should catch error from userHandler and nack message', () => {
    userHandler = sinon.stub().throws(new Error('some internal error'))
    handler = makeHandler(userHandler)
    return handler(message).then(() => {
      expect(message.ack).to.have.not.been.called
      expect(message.nack).to.have.been.called
    })
  })
  it('should catch rejected promise from userHandler and nack message', () => {
    userHandler = sinon.stub().rejects(new Error('some internal error'))
    handler = makeHandler(userHandler)
    return handler(message).then(() => {
      expect(message.ack).to.have.not.been.called
      expect(message.nack).to.have.been.called
    })
  })
})
