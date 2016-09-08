const sinon = require('sinon')

const makeHandler = require('../../../../lib/respond/makeHandler')

const message = {
  type: 'messageType',
  body: {
    payload: 42
  }
}

describe('makeHandler', () => {
  let userHandler
  let handler
  beforeEach(() => {
    userHandler = sinon.spy()
    handler = makeHandler(userHandler)
  })
  it('should return user-friendly handler', () => {
    expect(handler).to.be.fn
  })
  it('should return handler which call userHandler with payload and actions', () => {
    handler(message)
    expect(userHandler).to.have.been.calledWithMatch(42, {}, 'messageType') // actions object
  })
})
