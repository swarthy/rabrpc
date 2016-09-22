const rpc = require('../../index')
const Promise = require('bluebird')
const sinon = require('sinon')

const config = {
  connection: {},
  pub: {serviceName: 'pub-sub-test-service', replyTimeout: 30000, autoDelete: true}, // exchange config
  sub: {serviceName: 'pub-sub-test-service', noBatch: true, autoDelete: true} // queue config
}

describe('integration pub-sub', () => {
  let someAction
  before(() => {
    someAction = sinon.stub()
    rpc.subscribe('v1.pub-sub-test-service.someAction', someAction)
    return rpc.configure(config)
  })

  it('should handle', () => {
    return rpc.publish('v1.pub-sub-test-service.someAction', {a: 10, b: 5})
    .then(() => Promise.delay(50))
    .then(() => {
      expect(someAction).to.have.been.called
      expect(someAction).to.have.been.calledWithMatch({a: 10, b: 5}, 'v1.pub-sub-test-service.someAction')
    })
  })
})
