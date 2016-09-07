const sinon = require('sinon')

const makeResponseActions = require('../../../../lib/respond/makeResponseActions')

describe('makeResponseActions', () => {
  let message
  beforeEach(() => {
    message = {
      reply: sinon.spy()
    }
  })
  it('should process success', () => {
    const actions = makeResponseActions(message)
    actions.success(42)
    expect(message.reply).to.have.been.calledWithMatch({status: 'success', data: 42})
  })
  it('should process fail', () => {
    const actions = makeResponseActions(message)
    actions.fail(42)
    expect(message.reply).to.have.been.calledWithMatch({status: 'fail', data: 42})
  })
  it('should process error', () => {
    const actions = makeResponseActions(message)
    actions.error('some message')
    expect(message.reply).to.have.been.calledWithMatch({status: 'error', message: 'some message'})
    actions.error({code: 42, message: 'some message'})
    expect(message.reply).to.have.been.calledWithMatch({status: 'error', code: 42, message: 'some message'})
  })
})
