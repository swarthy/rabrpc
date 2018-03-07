const sinon = require('sinon')

const makeHandler = require('../../../../lib/receive/makeHandler')

const message = {
  properties: {
    headers: {
      protocol: 1
    }
  },
  type: 'messageType',
  body: 42,
  ack: sinon.spy(),
  nack: sinon.spy()
}

const oldMessage = {
  properties: {
    headers: {}
  },
  type: 'messageType',
  body: { payload: 42 },
  ack: sinon.spy(),
  nack: sinon.spy()
}

const singleton = {
  initialized: true
}

describe('receive makeHandler', () => {
  let userHandler
  let handler
  let messageHandler
  beforeEach(() => {
    userHandler = sinon.stub()
    userHandler.returns(137)

    message.ack.resetHistory()
    message.nack.resetHistory()
    oldMessage.ack.resetHistory()
    oldMessage.nack.resetHistory()

    handler = makeHandler.call(singleton, userHandler)
    messageHandler = makeHandler.call(singleton, userHandler, true)
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
  it('should return handler which call userHandler with payload and actions (version 0 compatibility)', async () => {
    await handler(oldMessage)
    expect(userHandler).to.have.been.calledWithMatch(42, {}, 'messageType') // actions object
    expect(oldMessage.ack).to.have.been.called
    expect(oldMessage.nack).to.have.not.been.called
  })
  it('should return handler which call userHandler with message and actions if raw=true', async () => {
    await messageHandler(message)
    expect(userHandler).to.have.been.calledWithMatch(message, {}, 'messageType') // actions object
    expect(message.ack).to.have.been.called
    expect(message.nack).to.have.not.been.called
  })
  it('should catch error from userHandler and nack message', async () => {
    userHandler = sinon.stub().throws(new Error('some internal error'))
    handler = makeHandler.call(singleton, userHandler)
    await handler(message)
    expect(message.ack).to.have.not.been.called
    expect(message.nack).to.have.been.called
  })
  it('should catch rejected promise from userHandler and nack message', async () => {
    userHandler = sinon.stub().rejects(new Error('some internal error'))
    handler = makeHandler.call(singleton, userHandler)
    await handler(message)
    expect(message.ack).to.have.not.been.called
    expect(message.nack).to.have.been.called
  })
})
