const rpc = require('../../index')
const Promise = require('bluebird')

const config = {
  connection: {},
  req: {serviceName: 'test-service', replyTimeout: 30000, autoDelete: true}, // exchange config
  res: {serviceName: 'test-service', noBatch: true, autoDelete: true} // queue config
}

function mul (a, b) {
  return a * b
}

function div (a, b) {
  if (b === 0) {
    throw new Error('division by zero!!!')
  }
  return a / b
}

describe('integration', () => {
  before(() => {
    rpc.respond('v1.test-service.mul', (payload, actions, messageType) => {
      expect(messageType).to.be.eql('v1.test-service.mul')
      expect(payload).to.have.all.keys('a', 'b')
      return mul(payload.a, payload.b)
    })
    rpc.respond('v1.test-service.div', (payload, actions, messageType) => {
      expect(messageType).to.be.eql('v1.test-service.div')
      expect(payload).to.have.all.keys('a', 'b')
      return div(payload.a, payload.b)
    })
    rpc.respond('v1.test-service.make.me.some.#', (payload, actions, messageType) => {
      const [, , , , , drink] = messageType.split('.')
      return `${payload} cup of ${drink}`
    })
    return rpc.initialize(config)
  })
  after(() => Promise.delay(100).then(() => rpc.shutdown()))

  it('should respond with multipy result', () => {
    return rpc.request('v1.test-service.mul', {a: 10, b: 5})
    .then(body => {
      expect(body.status).to.be.eql('success')
      expect(body.data).to.be.eql(50)
    })
  })
  it('should respond with division result', () => {
    return rpc.request('v1.test-service.div', {a: 100, b: 2})
    .then(body => {
      expect(body.status).to.be.eql('success')
      expect(body.data).to.be.eql(50)
    })
  })
  it('should send me some tea', () => {
    return rpc.request('v1.test-service.make.me.some.tea', 10)
    .then(body => {
      expect(body.status).to.be.eql('success')
      expect(body.data).to.be.eql('10 cup of tea')
    })
  })
})
