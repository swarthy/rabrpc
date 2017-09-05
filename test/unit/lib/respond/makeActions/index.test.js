const sinon = require('sinon')

const makeResponseActions = require('../../../../../lib/respond/makeActions')

describe('respond makeActions', () => {
  let message
  let actions
  beforeEach(() => {
    message = {
      reply: sinon.spy()
    }
    actions = makeResponseActions(message)
  })
  it('should process success', () => {
    actions.success(42)
    expect(message.reply).to.have.been.calledWithMatch({
      status: 'success',
      data: 42
    })
  })
  it('should process fail', () => {
    actions.fail(42)
    expect(message.reply).to.have.been.calledWithMatch({
      status: 'fail',
      data: 42
    })
  })
  it('should process error', () => {
    actions.error('some message')
    expect(message.reply).to.have.been.calledWithMatch({
      status: 'error',
      message: 'some message'
    })
  })
  it('should not process error without message', () => {
    expect(() => actions.error(new Error())).to.have.throw(
      /"message" must be defined when calling jsend.error/
    )
  })
  it('should process error with code', () => {
    const errorWithCode = new Error('ERROR WITH CODE')
    errorWithCode.code = 42
    actions.error(errorWithCode)
    expect(message.reply).to.have.been.calledWithMatch({
      status: 'error',
      code: 42,
      message: 'ERROR WITH CODE'
    })
  })
})
