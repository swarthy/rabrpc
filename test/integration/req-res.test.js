const rpc = require('../../index')

const config = {
  connection: {},
  req: 'test-service',
  res: 'test-service'
}
describe('integration', () => {
  before(() => {
    rpc.respond('v1.test-service.mul', (payload, actions) => {
      expect(payload).to.be.eql(42)
      return actions.success(payload * 2)
    })
    rpc.respond('v1.test-service.div', (payload, actions) => {
      expect(payload).to.be.eql(100)
      return actions.success(payload / 2)
    })
    return rpc.initialize(config)
  })
  after(() => {
    return rpc.shutdown()
  })
  it('should respond with mul by 2', () =>
    rpc.request('v1.test-service.mul', 42)
    .then(([body, actions]) => {
      expect(body.status).to.be.eql('success')
      expect(body.data).to.be.eql(84)
      return actions.ack()
    })
  )
  it('should respond with divided by 2', () =>
    rpc.request('v1.test-service.div', 100)
    .then(([body, actions]) => {
      expect(body.status).to.be.eql('success')
      expect(body.data).to.be.eql(50)
      return actions.ack()
    })
  )
})
