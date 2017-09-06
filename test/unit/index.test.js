const rpc = require('../../index')
const rabbot = require('rabbot')

const sinon = require('sinon')

describe('RPC', () => {
  before(() => {
    sinon.stub(rabbot, 'configure').resolves()
    sinon.stub(rabbot, 'closeAll').resolves()
    sinon.stub(rabbot, 'shutdown').resolves()
  })
  beforeEach(() => {
    rpc.initialized = undefined
    rabbot.configure.resetHistory()
    rabbot.closeAll.resetHistory()
    rabbot.shutdown.resetHistory()
  })
  after(() => {
    rabbot.configure.restore()
    rabbot.closeAll.restore()
    rabbot.shutdown.restore()
  })
  it('should have "errors" field', () => {
    expect(rpc.errors).to.be.ok
    expect(rpc.errors.RabRPCError).to.be.ok
  })
  describe('configure', () => {
    it('should call rabbot configure and set initialized to true on successfull initialization', async () => {
      await rpc.configure({ connection: 'localhost' })
      expect(rabbot.configure).to.have.been.calledOnce
      expect(rpc.initialized).to.be.true
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
    it('should reject promise on error and set initialized to false', async () => {
      rabbot.configure.rejects(new Error('MOCK ERROR'))
      await expect(rpc.configure({ a: 10 }, false)).to.rejectedWith(
        /MOCK ERROR/
      )
      expect(rpc.initialized).to.be.false
      rabbot.configure.resolves()
    })
  })
  describe('closeAll', () => {
    it('should not call rabbot closeAll if rpc not initialized', () => {
      expect(rpc.initialized).to.be.undefined
      rpc.closeAll()
      expect(rabbot.closeAll).to.have.not.been.called
    })
    it('should call rabbot closeAll if rpc initialized', async () => {
      await rpc.configure({}, false)
      expect(rpc.initialized).to.be.true
      await rpc.closeAll()
      expect(rabbot.closeAll).to.have.been.calledOnce
    })
  })
  describe('shutdown', () => {
    it('should not call rabbot shutdown if rpc not initialized', () => {
      expect(rpc.initialized).to.be.undefined
      rpc.shutdown()
      expect(rabbot.shutdown).to.have.not.been.called
    })
    it('should call rabbot shutdown if rpc initialized', async () => {
      await rpc.configure({}, false)
      expect(rpc.initialized).to.be.true
      await rpc.shutdown()
      expect(rabbot.shutdown).to.have.been.calledOnce
    })
  })
})
