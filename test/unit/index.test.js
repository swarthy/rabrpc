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
    it('should call rabbot configure and set initialized to true on successfull initialization', () => {
      return rpc.configure({ connection: 'localhost' }).then(() => {
        expect(rabbot.configure).to.have.been.calledOnce
        expect(rpc.initialized).to.be.true
      })
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
    it('should pass rabbot config', () => {
      return rpc
        .configure({ a: 10 }, false)
        .then(() =>
          expect(rabbot.configure).to.have.been.calledWithMatch({ a: 10 })
        )
    })
    it('should reject promise on error and set initialized to false', () => {
      rabbot.configure.rejects(new Error('MOCK ERROR'))
      expect(rpc.configure({ a: 10 }, false))
        .to.rejectedWith(/MOCK ERROR/)
        .then(() => expect(rpc.initialized).to.be.false)
        .then(() => rabbot.configure.resolves())
    })
  })
  describe('closeAll', () => {
    it('should not call rabbot closeAll if rpc not initialized', () => {
      expect(rpc.initialized).to.be.undefined
      rpc.closeAll()
      expect(rabbot.closeAll).to.have.not.been.called
    })
    it('should call rabbot closeAll if rpc initialized', () => {
      return rpc
        .configure({}, false)
        .then(() => expect(rpc.initialized).to.be.true)
        .then(() => rpc.closeAll())
        .then(() => expect(rabbot.closeAll).to.have.been.calledOnce)
    })
  })
  describe('shutdown', () => {
    it('should not call rabbot shutdown if rpc not initialized', () => {
      expect(rpc.initialized).to.be.undefined
      rpc.shutdown()
      expect(rabbot.shutdown).to.have.not.been.called
    })
    it('should call rabbot shutdown if rpc initialized', () => {
      return rpc
        .configure({}, false)
        .then(() => expect(rpc.initialized).to.be.true)
        .then(() => rpc.shutdown())
        .then(() => expect(rabbot.shutdown).to.have.been.calledOnce)
    })
  })
})
