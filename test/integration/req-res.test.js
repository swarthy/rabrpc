const rpc = require('../../index')

function delay (ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

const config = {
  connection: {},
  req: {serviceName: 'test-service', replyTimeout: 30000, autoDelete: true}, // exchange config
  res: {serviceName: 'test-service', autoDelete: true, noBatch: true} // queue config
}
describe('integration', () => {
  before(() => {
    rpc.respond('v1.test-service.mul', (payload, actions, messageType) => {
      expect(messageType).to.be.eql('v1.test-service.mul')
      expect(payload).to.be.eql(42)
      return actions.success(payload * 2)
    })
    rpc.respond('v1.test-service.div', (payload, actions, messageType) => {
      expect(messageType).to.be.eql('v1.test-service.div')
      expect(payload).to.be.eql(100)
      return actions.success(payload / 2)
    })
    return rpc.initialize(config)
  })
  after(() => {
    return delay(1000).then(() => rpc.shutdown())
  })
  it('should respond with mul by 2', () => {
    return rpc.request('v1.test-service.mul', 42)
    .then(body => {
      expect(body.status).to.be.eql('success')
      expect(body.data).to.be.eql(84)
    })
  })
  it('should respond with divided by 2', () => {
    return rpc.request('v1.test-service.div', 100)
    .then(body => {
      expect(body.status).to.be.eql('success')
      expect(body.data).to.be.eql(50)
    })
  })
})
