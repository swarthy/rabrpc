const rpc = require('../../index')
const Promise = require('bluebird')
const sinon = require('sinon')

const configPublish = {
  connection: {
    name: 'publish-connection'
  },
  pub: {serviceName: 'pub-sub-test-service', publishTimeout: 2000} // exchange config
}

const configSubscribe = {
  connection: {
    name: 'subscribe-connection'
  },
  sub: {serviceName: 'pub-sub-test-service', noBatch: true, autoDelete: true}
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

  after(() => rpc.shutdown())

  it('should handle', () => {
    return rpc.publish('v1.pub-sub-test-service.someAction', {a: 10, b: 5}, {connectionName: 'publish-connection'})
    .then(() => Promise.delay(50))
    .then(() => {
      expect(someAction).to.have.been.called
      expect(someAction).to.have.been.calledWithMatch({a: 10, b: 5}, 'v1.pub-sub-test-service.someAction')
    })
  })
})
