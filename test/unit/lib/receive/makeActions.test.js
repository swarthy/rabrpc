const sinon = require('sinon')

const makeActions = require('../../../../lib/receive/makeActions')

describe('receive makeActions', () => {
  let message
  beforeEach(() => {
    message = {
      ack: sinon.spy(),
      nack: sinon.spy(),
      reject: sinon.spy()
    }
  })
  it('should process ack', () => {
    const actions = makeActions(message)
    actions.ack()
    expect(message.ack).to.have.been.called
  })
  it('should process nack', () => {
    const actions = makeActions(message)
    actions.nack()
    expect(message.nack).to.have.been.called
  })
  it('should process reject', () => {
    const actions = makeActions(message)
    actions.reject()
    expect(message.reject).to.have.been.called
  })
})
