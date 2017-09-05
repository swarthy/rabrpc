const normalizeConfig = require('../../../../lib/transformConfig/normalizeConfig')

describe('transformConfig normalizeConfig', () => {
  it('should transform string into config with serviceName field', () => {
    expect(normalizeConfig('test')).to.be.eql({ serviceName: 'test' })
  })
  it('should pass config object', () => {
    const config = { serviceName: 'test' }
    expect(normalizeConfig(config)).to.be.equal(config)
  })
  it('should check serviceName in result', () => {
    expect(() => normalizeConfig({})).to.throw(/serviceName is required/)
  })
})
