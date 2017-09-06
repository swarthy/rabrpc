const {
  serialize,
  deserialize
} = require('../../../../lib/serializers/nullSerializer')

describe('null Serializer', () => {
  it('should correct serialize and deserialize', () => {
    expect(serialize(null)).to.be.eql(Buffer.from([]))
    expect(deserialize()).to.be.eql(null)
  })
})
