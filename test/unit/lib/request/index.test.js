const rpc = require('../../../../index')
const rabbot = require('rabbot')

const sinon = require('sinon')

describe('RPC', () => {
  before(() => {
    sinon.stub(rabbot, 'request').resolves({body: {payload: 42}})
    sinon.stub(rabbot, 'getExchange').returns({})
  })
  after(() => {
    rabbot.request.restore()
    rabbot.getExchange.restore()
  })
  describe('request', () => {
    it('should call rabbot request', () => {
      rpc.request('v1.test.action', 42)
      expect(rabbot.request).to.have.been.calledOnce
    })
    it('should make config for rabbot', () => {
      rpc.request('v1.test.action', 42)
      expect(rabbot.request).to.have.been.calledWithMatch('req-res.test', {
        routingKey: 'test',
        type: 'v1.test.action',
        replyTimeout: 10000,
        body: {payload: 42}
      })
    })
  })
})
