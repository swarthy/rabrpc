const sinon = require('sinon')
const makeReplyAction = require('../../../../../lib/respond/makeActions/makeReplyAction')

describe('respond makeActions makeReplyAction', () => {
  let dataFormatter
  let message
  let actions
  beforeEach(() => {
    dataFormatter = sinon.stub().returnsArg(0)
    actions = {
      processed: false
    }
    message = {
      type: 'some.type',
      reply: sinon.spy()
    }
  })
  it('should return function', () => {
    actions.test = makeReplyAction(message, dataFormatter)
    expect(actions.test).to.be.func
    actions.test({a: 1}, {option: 1})
    expect(dataFormatter).to.have.been.calledWithMatch({a: 1})
    expect(message.reply).to.have.been.calledWithMatch({a: 1}, {option: 1})
  })
})
