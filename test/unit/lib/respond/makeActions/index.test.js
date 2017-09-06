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
    expect(message.reply).to.have.been.calledWithMatch(42, {
      headers: {
        status: 'success'
      }
    })
  })
  it('should process error', () => {
    actions.error('some message')
    expect(message.reply).to.have.been.calledWithMatch(null, {
      headers: {
        status: 'error',
        code: 500,
        message: 'some message'
      }
    })
  })
  it('should process error with code', () => {
    const errorWithCode = new Error('ERROR WITH CODE')
    errorWithCode.code = 42
    actions.error(errorWithCode)
    expect(message.reply).to.have.been.calledWithMatch(null, {
      headers: {
        status: 'error',
        code: 42,
        message: 'ERROR WITH CODE'
      }
    })
  })
})
