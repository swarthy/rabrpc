const rpc = require('../../index')
const Promise = require('bluebird')
const sinon = require('sinon')

const configSend = {
  connection: {
    name: 'send-connection'
  },
  send: { serviceName: 'send-recv-test-service', publishTimeout: 2000 }
}

const configReceive = {
  connection: {
    name: 'recv-connection'
  },
  recv: {
    serviceName: 'send-recv-test-service',
    noBatch: true,
    autoDelete: true
  }
}

describe('integration send-recv', () => {
  let someAction
  let errorAction
  before(() => {
    someAction = sinon.stub()

    errorAction = sinon.stub()
    errorAction.onCall(0).throws(new Error('Error 1'))
    errorAction.onCall(1).throws(new Error('Error 2'))
    errorAction.onCall(2).returns(42)

    rpc.receive('v1.send-recv-test-service.someAction', someAction)
    rpc.receive('v1.send-recv-test-service.errorAction', errorAction)

    return Promise.all([
      rpc.configure(configSend),
      rpc.configure(configReceive)
    ])
  })

  beforeEach(() => {
    someAction.resetHistory()
  })

  after(() => rpc.shutdown())

  it('should nack message on error', async () => {
    expect(errorAction).to.have.not.been.called
    await rpc.send(
      'v1.send-recv-test-service.errorAction',
      { a: 20, b: 30 },
      { connectionName: 'send-connection' }
    )
    await Promise.delay(50)

    expect(errorAction).to.have.been.calledThrice
    expect(errorAction.firstCall).to.have.been.calledWithMatch(
      { a: 20, b: 30 },
      {},
      'v1.send-recv-test-service.errorAction'
    )
    expect(errorAction.secondCall).to.have.been.calledWithMatch(
      { a: 20, b: 30 },
      {},
      'v1.send-recv-test-service.errorAction'
    )
    expect(errorAction.thirdCall).to.have.been.calledWithMatch(
      { a: 20, b: 30 },
      {},
      'v1.send-recv-test-service.errorAction'
    )
  })

  it('should send string', async () => {
    await rpc.send('v1.send-recv-test-service.someAction', 'string', {
      connectionName: 'send-connection'
    })
    await Promise.delay(50)
    expect(someAction).to.have.been.called
    expect(someAction).to.have.been.calledWithMatch(
      'string',
      {},
      'v1.send-recv-test-service.someAction'
    )
  })

  it('should send number', async () => {
    await rpc.send('v1.send-recv-test-service.someAction', 123, {
      connectionName: 'send-connection'
    })
    await Promise.delay(50)
    expect(someAction).to.have.been.called
    expect(someAction).to.have.been.calledWithMatch(
      123,
      {},
      'v1.send-recv-test-service.someAction'
    )
  })

  it('should send object', async () => {
    await rpc.send(
      'v1.send-recv-test-service.someAction',
      { a: 5, b: null },
      {
        connectionName: 'send-connection'
      }
    )
    await Promise.delay(50)
    expect(someAction).to.have.been.called
    expect(someAction).to.have.been.calledWithMatch(
      { a: 5, b: null },
      {},
      'v1.send-recv-test-service.someAction'
    )
  })

  it('should send array', async () => {
    await rpc.send('v1.send-recv-test-service.someAction', [0, null, 'a'], {
      connectionName: 'send-connection'
    })
    await Promise.delay(50)
    expect(someAction).to.have.been.called
    expect(someAction).to.have.been.calledWithMatch(
      [0, null, 'a'],
      {},
      'v1.send-recv-test-service.someAction'
    )
  })

  it('should send null', async () => {
    await rpc.send('v1.send-recv-test-service.someAction', null, {
      connectionName: 'send-connection'
    })
    await Promise.delay(50)
    expect(someAction).to.have.been.called
    expect(someAction).to.have.been.calledWithMatch(
      null,
      {},
      'v1.send-recv-test-service.someAction'
    )
  })

  it('should send Buffer', async () => {
    await rpc.send(
      'v1.send-recv-test-service.someAction',
      Buffer.from([1, 2]),
      {
        connectionName: 'send-connection'
      }
    )
    await Promise.delay(50)
    expect(someAction).to.have.been.called
    expect(someAction).to.have.been.calledWithMatch(
      Buffer.from([1, 2]),
      {},
      'v1.send-recv-test-service.someAction'
    )
  })
})
