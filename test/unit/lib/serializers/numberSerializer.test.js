const {
  serialize,
  deserialize
} = require('../../../../lib/serializers/numberSerializer')

describe('Number Serializer', () => {
  it('should correct serialize and deserialize numbers', () => {
    expect(deserialize(serialize(0))).to.be.eql(0)
    expect(deserialize(serialize(1))).to.be.eql(1)
    expect(deserialize(serialize(1.12345))).to.be.eql(1.12345)
    expect(deserialize(serialize(10000.12345))).to.be.eql(10000.12345)
    expect(deserialize(serialize(Number.MAX_SAFE_INTEGER))).to.be.eql(
      Number.MAX_SAFE_INTEGER
    )
    expect(deserialize(serialize(Number.POSITIVE_INFINITY))).to.be.eql(
      Number.POSITIVE_INFINITY
    )
    expect(deserialize(serialize(Number.NEGATIVE_INFINITY))).to.be.eql(
      Number.NEGATIVE_INFINITY
    )
  })
})
