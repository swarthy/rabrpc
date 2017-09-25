const sinon = require('sinon')

const makeHandler = require('../../../../lib/respond/makeHandler')

const message = {
  properties: {
    headers: {
      protocol: 1
    }
  },
  type: 'messageType',
  body: 42,
  reply: sinon.spy()
}

const oldMessage = {
  properties: {
    headers: {}
  },
  type: 'messageType',
  body: { payload: 42 },
  reply: sinon.spy()
}

const singleton = {
  initialized: true
}

describe('respond makeHandler', () => {
  let userHandler
  let handler
  let messageHandler
  beforeEach(() => {
    userHandler = sinon.stub().returns(137)
    handler = makeHandler.call(singleton, userHandler)
    messageHandler = makeHandler.call(singleton, userHandler, true)
    message.reply.reset()
    oldMessage.reply.reset()
  })
  it('should return user-friendly handler', () => {
    expect(handler).to.be.a('function')
    expect(messageHandler).to.be.a('function')
  })
  it('should return handler which call userHandler with payload and actions', async () => {
    await handler(message)
    expect(userHandler).to.have.been.calledWithMatch(42, {}, 'messageType') // actions object
    expect(message.reply).to.have.been.calledWithMatch(137, {
      headers: {
        status: 'success'
      }
    })
  })
  it('should return handler which call userHandler with payload and actions (version 0 compatibility)', async () => {
    await handler(oldMessage)
    expect(userHandler).to.have.been.calledWithMatch(42, {}, 'messageType') // actions object
    expect(oldMessage.reply).to.have.been.calledWithMatch(137, {
      headers: {
        status: 'success'
      }
    })
  })
  it('should return handler which call userHandler with message and actions if raw=true', async () => {
    await messageHandler(message)
    expect(userHandler).to.have.been.calledWithMatch(message, {}, 'messageType') // actions object
    expect(message.reply).to.have.been.calledWithMatch(137, {
      headers: {
        status: 'success'
      }
    })
  })
  it('should catch error from userHandler and respond error', async () => {
    userHandler = sinon.stub().throws(new Error('some internal error'))
    handler = makeHandler.call(singleton, userHandler)
    await handler(message)
    expect(message.reply).to.have.been.calledWithMatch(null, {
      headers: {
        status: 'error',
        message: 'some internal error',
        code: 500
      }
    })
  })
  it('should catch rejected promise from userHandler and respond error', async () => {
    userHandler = sinon.stub().rejects(new Error('some internal error'))
    handler = makeHandler.call(singleton, userHandler)
    await handler(message)
    expect(message.reply).to.have.been.calledWithMatch(null, {
      headers: {
        status: 'error',
        message: 'some internal error',
        code: 500
      }
    })
  })
})
