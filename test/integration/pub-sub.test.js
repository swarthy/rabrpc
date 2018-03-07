const rpc = require('../../index')
const Promise = require('bluebird')
const sinon = require('sinon')

const configPublish = {
  connection: {
    name: 'publish-connection'
  },
  pub: { serviceName: 'pub-sub-test-service', publishTimeout: 2000 } // exchange config
}

const configSubscribe = {
  connection: {
    name: 'subscribe-connection'
  },
  sub: { serviceName: 'pub-sub-test-service', noBatch: true }
}

describe('integration pub-sub', () => {
  let someAction
  before(() => {
    someAction = sinon.stub()
    rpc.subscribe('v1.pub-sub-test-service.someAction', someAction)
    return Promise.all([
      rpc.configure(configPublish),
      rpc.configure(configSubscribe)
    ])
  })

  beforeEach(() => {
    someAction.resetHistoryHistory()
  })

  after(() => rpc.shutdown())

  it('should publish string', async () => {
    await rpc.publish('v1.pub-sub-test-service.someAction', 'string', {
      connectionName: 'publish-connection'
    })
    await Promise.delay(100)
    expect(someAction).to.have.been.calledWithMatch(
      'string',
      'v1.pub-sub-test-service.someAction'
    )
  })

  it('should publish number', async () => {
    await rpc.publish('v1.pub-sub-test-service.someAction', 123, {
      connectionName: 'publish-connection'
    })
    await Promise.delay(100)
    expect(someAction).to.have.been.calledWithMatch(
      123,
      'v1.pub-sub-test-service.someAction'
    )
  })

  it('should publish object', async () => {
    await rpc.publish(
      'v1.pub-sub-test-service.someAction',
      { a: 5, b: null },
      { connectionName: 'publish-connection' }
    )
    await Promise.delay(100)
    expect(someAction).to.have.been.calledWithMatch(
      { a: 5, b: null },
      'v1.pub-sub-test-service.someAction'
    )
  })

  it('should publish array', async () => {
    await rpc.publish('v1.pub-sub-test-service.someAction', [0, null, 'a'], {
      connectionName: 'publish-connection'
    })
    await Promise.delay(100)
    expect(someAction).to.have.been.calledWithMatch(
      [0, null, 'a'],
      'v1.pub-sub-test-service.someAction'
    )
  })

  it('should publish null', async () => {
    await rpc.publish('v1.pub-sub-test-service.someAction', null, {
      connectionName: 'publish-connection'
    })
    await Promise.delay(100)
    expect(someAction).to.have.been.calledWithMatch(
      null,
      'v1.pub-sub-test-service.someAction'
    )
  })

  it('should publish Buffer', async () => {
    await rpc.publish(
      'v1.pub-sub-test-service.someAction',
      Buffer.from([1, 2]),
      { connectionName: 'publish-connection' }
    )
    await Promise.delay(100)
    expect(someAction).to.have.been.calledWithMatch(
      Buffer.from([1, 2]),
      'v1.pub-sub-test-service.someAction'
    )
  })

  it('should stop consume messages after stopSubscription', async () => {
    rpc.stopSubscription()
    await rpc.publish('v1.pub-sub-test-service.someAction', 123, {
      connectionName: 'publish-connection'
    })
    await Promise.delay(100)
    expect(someAction).to.have.not.been.called
  })
})
