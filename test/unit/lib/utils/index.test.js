const utils = require('../../../../lib/utils')
const sinon = require('sinon')

const rabbot = require('rabbot')

describe('utils', () => {
  describe('verifyExchange', () => {
    before(() => {
      sinon.stub(rabbot, 'getExchange')
      rabbot.getExchange.onCall(0).returns()
      rabbot.getExchange.onCall(1).returns({})
    })
    after(() => {
      rabbot.getExchange.restore()
    })
    it('should throw error if exchange is not configured', () => {
      expect(() => utils.verifyExchange('test')).to.throw(/does not exist/)
      expect(rabbot.getExchange).to.have.been.calledWithMatch('test')
    })
    it('should do nothing if exchange exist', () => {
      utils.verifyExchange('exist')
      expect(rabbot.getExchange).to.have.been.calledWithMatch('exist')
    })
  })
  describe('parseMessageType', () => {
    before(() => {
      sinon.stub(utils, 'verifyExchange').returns()
    })
    after(() => {
      utils.verifyExchange.restore()
    })
    it('should return object with exchangeName and serviceName', () => {
      expect(utils.parseMessageType('PREFIX', 'VERSION.SERVICE_NAME.ACTION')).to.be.eql({
        exchangeName: 'PREFIX.SERVICE_NAME',
        serviceName: 'SERVICE_NAME'
      })
    })
  })
})
