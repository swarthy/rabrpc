const parseQueue = require('../../../../../lib/transformConfig/req-res/parseQueue')

describe('transformConfig req-res parseQueue', () => {
  it('should return queue config with merged options', () => {
    const config = parseQueue({serviceName: 'test', limit: 15})
    expect(config.name).to.be.eql('req-res.test')
    expect(config.subscribe).to.be.eql(true)
    expect(config.limit).to.be.eql(15)
  })
})
