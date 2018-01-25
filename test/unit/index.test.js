const rpc = require('../../index')
const rabbot = require('rabbot')

const sinon = require('sinon')

describe('RPC', () => {
  before(() => {
    sinon.stub(rabbot, 'configure').resolves()
    sinon.stub(rabbot, 'shutdown').resolves()
    sinon.stub(rabbot, 'reset').resolves()
  })
  beforeEach(() => {
    rpc.initialized = undefined
    rabbot.configure.resetHistory()
    rabbot.shutdown.resetHistory()
    rabbot.reset.resetHistory()
  })
  after(() => {
    rabbot.configure.restore()
    rabbot.shutdown.restore()
    rabbot.reset.restore()
  })
  it('should have "errors" field', () => {
    expect(rpc.errors).to.be.ok
    expect(rpc.errors.RabRPCError).to.be.ok
  })
  describe('configure', () => {
    it('should call rabbot configure', async () => {
      await rpc.configure({ connection: 'localhost' })
      expect(rabbot.configure).to.have.been.calledOnce
    })
    it('should make config for rabbot', () => {
      rpc.configure({ connection: 'localhost' })
      expect(rabbot.configure).to.have.been.calledWithMatch({
        bindings: [],
        connection: { uri: 'localhost' },
        exchanges: [],
        queues: []
      })
    })
    it('should pass rabbot config', async () => {
      await rpc.configure({ a: 10 }, false)
      expect(rabbot.configure).to.have.been.calledWithMatch({ a: 10 })
    })
    it('should reject promise on error', async () => {
      rabbot.configure.rejects(new Error('MOCK ERROR'))
      await expect(rpc.configure({ a: 10 }, false)).to.rejectedWith(
        /MOCK ERROR/
      )
      rabbot.configure.resolves()
    })
  })
  describe('shutdown', () => {
    it('should call rabbot shutdown if rpc initialized', async () => {
      await rpc.shutdown()
      expect(rabbot.shutdown).to.have.been.calledOnce
      expect(rabbot.reset).to.have.been.calledOnce
    })
  })
})
