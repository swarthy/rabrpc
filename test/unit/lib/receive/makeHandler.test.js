const sinon = require('sinon')

const makeHandler = require('../../../../lib/receive/makeHandler')

const message = {
  type: 'messageType',
  body: 42,
  ack: sinon.spy(),
  nack: sinon.spy()
}

describe('receive makeHandler', () => {
  let userHandler
  let handler
  let messageHandler
  beforeEach(() => {
    userHandler = sinon.stub()
    userHandler.returns(137)

    message.ack.reset()
    message.nack.reset()
    handler = makeHandler(userHandler)
    messageHandler = makeHandler(userHandler, true)
  })
  it('should return user-friendly handler', () => {
    expect(handler).to.be.a('function')
    expect(messageHandler).to.be.a('function')
  })
  it('should return handler which call userHandler with payload and actions', async () => {
    await handler(message)
    expect(userHandler).to.have.been.calledWithMatch(42, {}, 'messageType') // actions object
    expect(message.ack).to.have.been.called
    expect(message.nack).to.have.not.been.called
  })
  it('should return handler which call userHandler with message and actions if raw=true', async () => {
    await messageHandler(message)
    expect(userHandler).to.have.been.calledWithMatch(message, {}, 'messageType') // actions object
    expect(message.ack).to.have.been.called
    expect(message.nack).to.have.not.been.called
  })
  it('should catch error from userHandler and nack message', async () => {
    userHandler = sinon.stub().throws(new Error('some internal error'))
    handler = makeHandler(userHandler)
    await handler(message)
    expect(message.ack).to.have.not.been.called
    expect(message.nack).to.have.been.called
  })
  it('should catch rejected promise from userHandler and nack message', async () => {
    userHandler = sinon.stub().rejects(new Error('some internal error'))
    handler = makeHandler(userHandler)
    await handler(message)
    expect(message.ack).to.have.not.been.called
    expect(message.nack).to.have.been.called
  })
})
