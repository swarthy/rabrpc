const format = require('../../../../../lib/respond/makeActions/format')

describe('respond makeActions format', () => {
  it('success', () => {
    expect(format.success({ value: 5 })).to.be.eql({
      status: 'success',
      data: { value: 5 }
    })
  })
})
