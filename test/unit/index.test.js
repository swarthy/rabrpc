const rpc = require('../../index')
const rabbot = require('rabbot')

const sinon = require('sinon')

describe('RPC', () => {
  before(() => {
    sinon.stub(rabbot, 'configure').resolves()
    sinon.stub(rabbot, 'shutdown').resolves()
  })
  after(() => {
    rabbot.configure.restore()
    rabbot.shutdown.restore()
  })
  describe('initialize', () => {
    it('should call rabbot configure', () => {
      rpc.initialize({connection: 'localhost'})
      expect(rabbot.configure).to.have.been.calledOnce
    })
    it('should make config for rabbot', () => {
      rpc.initialize({connection: 'localhost'})
      expect(rabbot.configure).to.have.been.calledWithMatch({
        bindings: [],
        connection: {uri: 'localhost'},
        exchanges: [],
        queues: []
      })
    })
    it('should pass rabbot config', () => {
      rpc.initialize({a: 10}, false)
      expect(rabbot.configure).to.have.been.calledWithMatch({a: 10})
    })
    it('should reject promise on error', () => {
      rabbot.configure.rejects()
      expect(rpc.initialize({a: 10}, false)).to.rejected
    })
  })
  describe('shutdown', () => {
    it('should call rabbot shutdown', () => {
      rpc.shutdown()
      expect(rabbot.shutdown).to.have.been.calledOnce
    })
  })
})
