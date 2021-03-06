const rpc = require('../../../../index')
const rabbot = require('rabbot')

const sinon = require('sinon')

describe('request', () => {
  before(() => {
    const mockMessage = {
      body: { payload: 42 },
      ack() {},
      properties: { headers: {} }
    }
    sinon.stub(rabbot, 'request').resolves(mockMessage)
    const getExchange = sinon.stub(rabbot, 'getExchange')
    getExchange.onCall(0).returns(null)
    getExchange.returns({})
  })
  after(() => {
    rabbot.request.restore()
    rabbot.getExchange.restore()
  })
  it('should throw error if exchange doest not exists', () => {
    expect(() => rpc.request('v1.test.action', 42)).to.throw(
      /Exchange with name 'req-res.test' does not exist/
    )
  })
  it('should call rabbot request', () => {
    rpc.request('v1.test.action', 42)
    expect(rabbot.request).to.have.been.calledOnce
  })
  it('should make config for rabbot', () => {
    rpc.request('v1.test.action', 42)
    expect(rabbot.request).to.have.been.calledWithMatch('req-res.test', {
      routingKey: 'test',
      type: 'v1.test.action',
      body: 42,
      headers: {
        protocol: 1
      }
    })
  })
})
