const sinon = require('sinon')

const makeActions = require('../../../lib/makeActions')

describe('makeActions', () => {
  it('should make actions for message', () => {
    const message = {
      ack: sinon.spy(),
      nack: sinon.spy(),
      reject: sinon.spy()
    }
    const actions = makeActions(message)
    actions.ack()
    actions.nack()
    actions.reject()
    expect(message.ack).has.been.calledOnce
    expect(message.nack).has.been.calledOnce
    expect(message.reject).has.been.calledOnce
  })
})
