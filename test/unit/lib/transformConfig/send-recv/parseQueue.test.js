const parseQueue = require('../../../../../lib/transformConfig/send-recv/parseQueue')

describe('transformConfig send-recv parseQueue', () => {
  it('should return queue config with merged options', () => {
    const config = parseQueue({serviceName: 'test', limit: 15})
    expect(config.name).to.be.eql('send-recv.test')
    expect(config.subscribe).to.be.eql(true)
    expect(config.limit).to.be.eql(15)
  })
})
