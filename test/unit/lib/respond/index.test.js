const rpc = require('../../../../index')
const rabbot = require('rabbot')

const sinon = require('sinon')

describe('respond', () => {
  before(() => {
    sinon.stub(rabbot, 'handle')
  })
  after(() => {
    rabbot.handle.restore()
  })
  it('should call rabbot request', () => {
    rpc.respond('v1.test.action', () => {})
    expect(rabbot.handle).to.have.been.calledOnce
  })
  it('should make config for rabbot', () => {
    const handler = sinon.spy()
    rpc.respond('v1.test.action', handler)
    expect(rabbot.handle).to.have.been.calledWithMatch('v1.test.action')
    expect(handler).to.have.not.been.called
  })
})
