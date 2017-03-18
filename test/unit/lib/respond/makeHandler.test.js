const sinon = require('sinon')

const makeHandler = require('../../../../lib/respond/makeHandler')

const message = {
  type: 'messageType',
  body: {
    payload: 42
  },
  reply: sinon.spy()
}

describe('respond makeHandler', () => {
  let userHandler
  let handler
  beforeEach(() => {
    userHandler = sinon.stub().returns(137)
    handler = makeHandler(userHandler)
  })
  it('should return user-friendly handler', () => {
    expect(handler).to.be.fn
  })
  it('should return handler which call userHandler with payload and actions', () => {
    return handler(message)
    .then(() => {
      expect(userHandler).to.have.been.calledWithMatch(42, {}, 'messageType') // actions object
      expect(message.reply).to.have.been.calledWithMatch({status: 'success', data: 137})
    })
  })
  it('should catch error from userHandler and respond error', () => {
    userHandler = sinon.stub().throws(new Error('some internal error'))
    handler = makeHandler(userHandler)
    return handler(message)
    .then(() => {
      expect(message.reply).to.have.been.calledWithMatch({status: 'error', message: 'some internal error'})
    })
    .catch(err => console.error('ERROR', err))
  })
  it('should catch rejected promise from userHandler and respond error', () => {
    userHandler = sinon.stub().rejects(new Error('some internal error'))
    handler = makeHandler(userHandler)
    return handler(message)
    .then(() => {
      expect(message.reply).to.have.been.calledWithMatch({status: 'error', message: 'some internal error'})
    })
    .catch(err => console.error('ERROR', err))
  })
})
