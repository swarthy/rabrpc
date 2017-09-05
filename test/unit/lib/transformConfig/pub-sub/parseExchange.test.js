const parseExchange = require('../../../../../lib/transformConfig/pub-sub/parseExchange')

describe('transformConfig pub-sub parseExchange', () => {
  it('should return exchange config without merging options', () => {
    const config = parseExchange({
      serviceName: 'test',
      autoDelete: true,
      replyTimeout: 1234
    })
    expect(config.name).to.be.eql('pub-sub.test')
    expect(config.type).to.be.eql('fanout')
    expect(config.autoDelete).to.not.be.true
    expect(config.replyTimeout).to.not.be.eql(1234)
  })
  it('should return merged exchange config if second argument is true', () => {
    const config = parseExchange(
      { serviceName: 'test', autoDelete: true, replyTimeout: 1234 },
      true
    )
    expect(config.name).to.be.eql('pub-sub.test')
    expect(config.type).to.be.eql('fanout')
    expect(config.autoDelete).to.be.true
    expect(config.replyTimeout).to.be.eql(1234)
  })
})
