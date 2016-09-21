const rpc = require('../../index')
const rabbot = require('rabbot')

const sinon = require('sinon')

describe('RPC', () => {
  before(() => {
    sinon.stub(rabbot, 'configure').resolves()
    sinon.stub(rabbot, 'shutdown').resolves()
  })
  beforeEach(() => {
    rabbot.configure.reset()
    rabbot.shutdown.reset()
  })
  after(() => {
    rabbot.configure.restore()
    rabbot.shutdown.restore()
  })
  describe('configure', () => {
    it('should call rabbot configure', () => {
      rpc.configure({connection: 'localhost'})
      expect(rabbot.configure).to.have.been.calledOnce
    })
    it('should make config for rabbot', () => {
      rpc.configure({connection: 'localhost'})
      expect(rabbot.configure).to.have.been.calledWithMatch({
        bindings: [],
        connection: {uri: 'localhost'},
        exchanges: [],
        queues: []
      })
    })
    it('should pass rabbot config', () => {
      rpc.configure({a: 10}, false)
      expect(rabbot.configure).to.have.been.calledWithMatch({a: 10})
    })
    it('should reject promise on error', () => {
      rabbot.configure.rejects(new Error('MOCK ERROR'))
      expect(rpc.configure({a: 10}, false)).to.rejectedWith(/MOCK ERROR/)
    })
  })
  describe('shutdown', () => {
    it('should call rabbot shutdown', () => {
      rpc.shutdown()
      expect(rabbot.shutdown).to.have.been.calledOnce
    })
  })
})
