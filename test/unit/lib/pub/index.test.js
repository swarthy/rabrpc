const rpc = require('../../../../index')
const rabbot = require('rabbot')

const sinon = require('sinon')

describe('publish', () => {
  before(() => {
    const mockMessage = {body: {payload: 42}, ack () {}}
    sinon.stub(rabbot, 'publish').resolves(mockMessage)
    const getExchange = sinon.stub(rabbot, 'getExchange')
    getExchange.onCall(0).returns(null)
    getExchange.returns({})
  })
  after(() => {
    rabbot.publish.restore()
    rabbot.getExchange.restore()
  })
  it('should throw error if exchange doest not exists', () => {
    expect(() => rpc.publish('v1.test.action', 42)).to.throw(/Exchange with name 'pub-sub.test' does not exist/)
  })
  it('should call rabbot publish', () => {
    rpc.publish('v1.test.action', 42)
    expect(rabbot.publish).to.have.been.calledOnce
  })
  it('should make config for rabbot', () => {
    rpc.publish('v1.test.action', 42)
    expect(rabbot.publish).to.have.been.calledWithMatch('pub-sub.test', {
      routingKey: 'test',
      type: 'v1.test.action',
      body: {payload: 42}
    })
  })
})
