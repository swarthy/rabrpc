const sinon = require('sinon')

const makeHandler = require('../../../../lib/sub/makeHandler')

const message = {
  type: 'messageType',
  body: 42,
  ack: sinon.spy()
}

describe('subscribe makeHandler', () => {
  let userHandler
  let handler
  beforeEach(() => {
    userHandler = sinon.stub().returns(137)
    message.ack.reset()
    handler = makeHandler(userHandler)
  })
  it('should return user-friendly handler', () => {
    expect(handler).to.be.a('function')
  })
  it('should return handler which call userHandler with payload and actions', () => {
    return handler(message).then(() => {
      expect(userHandler).to.have.been.calledWithMatch(42, 'messageType') // actions object
      expect(message.ack).to.have.been.called
    })
  })
})
