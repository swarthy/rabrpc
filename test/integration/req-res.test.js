const rpc = require('../../index')
const sinon = require('sinon')

const configRequest = {
  connection: {
    name: 'request-connection'
  },
  req: {
    serviceName: 'req-res-test-service',
    publishTimeout: 1000,
    replyTimeout: 1000
  } // exchange config
}

const configResponse = {
  connection: {
    name: 'response-connection'
  },
  res: { serviceName: 'req-res-test-service', noBatch: true, autoDelete: true } // queue config
}

describe('integration req-res', () => {
  let ping
  let error

  before(() => {
    ping = sinon.stub()
    ping.returnsArg(0)

    error = sinon.stub()
    error.throws(new Error('Some error'))

    rpc.respond('v1.req-res-test-service.ping', ping)
    rpc.respond('v1.req-res-test-service.error', error)

    return Promise.all([
      rpc.configure(configRequest),
      rpc.configure(configResponse)
    ])
  })

  beforeEach(() => {
    ping.resetHistory()
    error.resetHistory()
  })

  after(() => rpc.shutdown())

  it('should respond with error', async () => {
    try {
      await rpc.request('v1.req-res-test-service.error', 'test', {
        connectionName: 'request-connection'
      })
    } catch (err) {
      expect(err.message).to.be.eql('Some error')
    }

    expect(error).to.have.been.called
  })

  it('should request and respond string', async () => {
    const message = await rpc.request(
      'v1.req-res-test-service.ping',
      'string',
      { connectionName: 'request-connection' },
      true
    )
    expect(message.properties.headers.status).to.be.eql('success')
    expect(message.body).to.be.eql('string')
    expect(ping).to.be.called
  })

  it('should request and respond number', async () => {
    const message = await rpc.request(
      'v1.req-res-test-service.ping',
      123,
      { connectionName: 'request-connection' },
      true
    )
    expect(message.properties.headers.status).to.be.eql('success')
    expect(message.body).to.be.eql(123)
    expect(ping).to.be.called
  })

  it('should request and respond object', async () => {
    const message = await rpc.request(
      'v1.req-res-test-service.ping',
      { a: 5, b: null },
      { connectionName: 'request-connection' },
      true
    )
    expect(message.properties.headers.status).to.be.eql('success')
    expect(message.body).to.be.eql({ a: 5, b: null })
    expect(ping).to.be.called
  })

  it('should request and respond array', async () => {
    const message = await rpc.request(
      'v1.req-res-test-service.ping',
      [0, null, 'a'],
      { connectionName: 'request-connection' },
      true
    )
    expect(message.properties.headers.status).to.be.eql('success')
    expect(message.body).to.be.eql([0, null, 'a'])
    expect(ping).to.be.called
  })

  it('should request and respond null', async () => {
    const message = await rpc.request(
      'v1.req-res-test-service.ping',
      null,
      { connectionName: 'request-connection' },
      true
    )
    expect(message.properties.headers.status).to.be.eql('success')
    expect(message.body).to.be.eql(null)
    expect(ping).to.be.called
  })

  it('should request and respond Buffer', async () => {
    const message = await rpc.request(
      'v1.req-res-test-service.ping',
      Buffer.from([1, 2]),
      { connectionName: 'request-connection' },
      true
    )
    expect(message.properties.headers.status).to.be.eql('success')
    expect(message.body).to.be.eql(Buffer.from([1, 2]))
    expect(ping).to.be.calledWithMatch(
      Buffer.from([1, 2]),
      {},
      'v1.req-res-test-service.ping'
    )
  })

  it('should stop consume messages after stopSubscription', async () => {
    rpc.stopSubscription()
    let error
    try {
      await rpc.request('v1.req-res-test-service.ping', 'test', {
        connectionName: 'request-connection'
      })
    } catch (err) {
      error = err
    }
    expect(error.message).to.match(
      /No reply received within the configured timeout/
    )
    expect(ping).to.have.not.been.called
  })
})
