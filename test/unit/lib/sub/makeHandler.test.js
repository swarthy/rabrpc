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
  let messageHandler
  beforeEach(() => {
    userHandler = sinon.stub().returns(137)
    message.ack.reset()
    handler = makeHandler(userHandler)
    messageHandler = makeHandler(userHandler, true)
  })
  it('should return user-friendly handler', () => {
    expect(handler).to.be.a('function')
    expect(messageHandler).to.be.a('function')
  })
  it('should return handler which call userHandler with payload and actions', async () => {
    await handler(message)
    expect(userHandler).to.have.been.calledWithMatch(42, 'messageType') // actions object
    expect(message.ack).to.have.been.called
  })
  it('should return handler which call userHandler with message and actions if raw=true', async () => {
    await messageHandler(message)
    expect(userHandler).to.have.been.calledWithMatch(message, 'messageType') // actions object
    expect(message.ack).to.have.been.called
  })
})
