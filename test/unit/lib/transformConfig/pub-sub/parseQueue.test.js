const parseQueue = require('../../../../../lib/transformConfig/pub-sub/parseQueue')

const uuid = require('uuid')
const sinon = require('sinon')

describe('transformConfig pub-sub parseQueue', () => {
  before(() => {
    sinon.stub(uuid, 'v4').returns('zzz')
  })
  after(() => {
    uuid.v4.restore()
  })
  it('should return queue config with merged options', () => {
    const config = parseQueue({serviceName: 'test', limit: 15})
    expect(config.name).to.be.eql('pub-sub.test.zzz')
    expect(config.subscribe).to.be.eql(true)
    expect(config.limit).to.be.eql(15)
  })
})
