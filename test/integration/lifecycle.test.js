const rpc = require('../../index')
const Promise = require('bluebird')
const sinon = require('sinon')

const configSend = {
  connection: {
    name: 'send-connection'
  },
  send: { serviceName: 'lifecycle-service', publishTimeout: 2000 }
}

const configReceive = {
  connection: {
    name: 'recv-connection'
  },
  recv: {
    serviceName: 'lifecycle-service',
    noBatch: true,
    autoDelete: true
  }
}

describe('lifecycle', () => {
  const someAction = sinon.stub()

  beforeEach(() => {
    someAction.resetHistory()
  })

  describe('reinitialization', () => {
    it('should correct work in case: start -> shutdown -> start', async () => {
      // First initialization
      rpc.receive('v1.lifecycle-service.someAction', someAction)
      await rpc.configure(configSend)
      await rpc.configure(configReceive)

      // Sending/Receiving
      await rpc.send(
        'v1.lifecycle-service.someAction',
        { a: 10 },
        { connectionName: 'send-connection' }
      )
      await Promise.delay(100)
      expect(someAction).to.be.calledOnce

      // Shutting down
      await rpc.shutdown()

      someAction.resetHistory()

      // Second initialization
      rpc.receive('v1.lifecycle-service.someAction', someAction)
      await rpc.configure(configSend)
      await rpc.configure(configReceive)

      // Sending/Receiving
      await rpc.send(
        'v1.lifecycle-service.someAction',
        { a: 10 },
        { connectionName: 'send-connection' }
      )
      await Promise.delay(100)
      expect(someAction).to.be.calledOnce

      // Cleanup
      await rpc.shutdown()
    })

    it('should correct work in case: start -> stopSubscription -> shutdown -> start', async () => {
      // First initialization
      rpc.receive('v1.lifecycle-service.someAction', someAction)
      await rpc.configure(configSend)
      await rpc.configure(configReceive)

      // Sending/Receiving
      await rpc.send(
        'v1.lifecycle-service.someAction',
        { msg: 1 },
        { connectionName: 'send-connection' }
      )
      await Promise.delay(100)
      expect(someAction).to.been.calledOnce
      expect(someAction).to.been.calledWith({ msg: 1 })
      someAction.resetHistory()

      // Stop subscription
      rpc.stopSubscription()

      await rpc.send(
        'v1.lifecycle-service.someAction',
        { msg: 2 },
        { connectionName: 'send-connection' }
      )
      await Promise.delay(100)
      expect(someAction).to.not.been.called
      someAction.resetHistory()

      // Shutting down
      await rpc.shutdown()

      // Queue deleted, {msg:2} lost

      // Second initialization
      rpc.receive('v1.lifecycle-service.someAction', someAction)
      await rpc.configure(configSend)
      await rpc.configure(configReceive)

      // Sending/Receiving
      await rpc.send(
        'v1.lifecycle-service.someAction',
        { msg: 3 },
        { connectionName: 'send-connection' }
      )
      await Promise.delay(100)
      expect(someAction).to.have.been.calledOnce
      expect(someAction).to.have.been.calledWith({ msg: 3 })

      // Cleanup
      await rpc.shutdown()
    })
  })
})
