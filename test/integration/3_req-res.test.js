const rpc = require('../../index')
const sinon = require('sinon')

const config = {
  connection: {},
  req: {serviceName: 'req-res-test-service', publishTimeout: 2000, replyTimeout: 2000, autoDelete: true}, // exchange config
  res: {serviceName: 'req-res-test-service', noBatch: true, autoDelete: true} // queue config
}

describe('integration req-res', () => {
  let mul
  let div
  let drink
  before(() => {
    mul = sinon.stub()
    mul.resolves(50)

    div = sinon.stub()
    div.onCall(0).returns(150)
    div.onCall(1).throws(new Error('Division by zero'))

    drink = sinon.stub()
    drink.returns('Tea')

    rpc.respond('v1.req-res-test-service.mul', mul)
    rpc.respond('v1.req-res-test-service.div', div)
    rpc.respond('v1.req-res-test-service.make.me.some.#', drink)

    return rpc.configure(config).then(() => console.log('configured req-res'))
  })

  after(() => rpc.shutdown())

  it('should respond with multipy result', () => {
    return rpc.request('v1.req-res-test-service.mul', {a: 10, b: 5})
    .then(body => {
      expect(body.status).to.be.eql('success')
      expect(body.data).to.be.eql(50)

      expect(mul).to.have.been.called
      expect(mul).to.have.been.calledWithMatch({a: 10, b: 5}, {}, 'v1.req-res-test-service.mul')
    })
  })
  it('should respond with division result', () => {
    return rpc.request('v1.req-res-test-service.div', {a: 100, b: 2})
    .then(body => {
      expect(body.status).to.be.eql('success')
      expect(body.data).to.be.eql(150)

      expect(div).to.have.been.called
      expect(div).to.have.been.calledWithMatch({a: 100, b: 2}, {}, 'v1.req-res-test-service.div')
    })
  })
  it('should respond with division fail', () => {
    return rpc.request('v1.req-res-test-service.div', {a: 100, b: 0})
    .then(body => {
      expect(body.status).to.be.eql('error')
      expect(body.message).to.be.eql('Division by zero')

      expect(div).to.have.been.called
      expect(div).to.have.been.calledWithMatch({a: 100, b: 0}, {}, 'v1.req-res-test-service.div')
    })
  })
  it('should send me some tea', () => {
    return rpc.request('v1.req-res-test-service.make.me.some.tea', 10)
    .then(body => {
      expect(body.status).to.be.eql('success')
      expect(body.data).to.be.eql('Tea')

      expect(drink).to.have.been.called
      expect(drink).to.have.been.calledWithMatch(10, {}, 'v1.req-res-test-service.make.me.some.tea')
    })
  })
})
