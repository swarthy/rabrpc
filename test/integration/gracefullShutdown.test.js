const rpc = require('../../index')
const Promise = require('bluebird')

const configRequest = {
  connection: {
    name: 'shutdown-request-test-connection'
  },
  req: {
    serviceName: 'shutdown-test-service',
    publishTimeout: 500,
    replyTimeout: 500
  } // exchange config
}

const configResponse = {
  connection: {
    name: 'shutdown-response-response-connection'
  },
  res: { serviceName: 'shutdown-test-service', noBatch: true, autoDelete: true } // queue config
}

describe('gracefull shutdown', () => {
  before(async () => {
    const test = () => Promise.delay(200).then(() => 'test response')
    rpc.respond('v1.shutdown-test-service.test', test)
    await Promise.all([
      rpc.configure(configRequest),
      rpc.configure(configResponse)
    ])
  })

  it('should not try respond if rabbot already closed all connections', async () => {
    const reqPromise = rpc.request('v1.shutdown-test-service.test', null, {
      connectionName: 'shutdown-request-test-connection'
    })
    await Promise.delay(50)
    await rpc.shutdown()
    await expect(reqPromise).to.rejectedWith(
      /No reply received within the configured timeout/
    )
  })
})
