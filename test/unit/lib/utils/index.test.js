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
      expect(
        utils.parseMessageType('PREFIX', 'VERSION.SERVICE_NAME.ACTION')
      ).to.be.eql({
        exchangeName: 'PREFIX.SERVICE_NAME',
        serviceName: 'SERVICE_NAME'
      })
    })
  })
  describe('getContentType', () => {
    it('should return application/null for null', () => {
      expect(utils.getContentType(null)).to.be.eql('application/null')
    })
    it('should return application/number for number', () => {
      expect(utils.getContentType(0)).to.be.eql('application/number')
      expect(utils.getContentType(1)).to.be.eql('application/number')
      expect(utils.getContentType(1.1)).to.be.eql('application/number')
      expect(utils.getContentType(Number.NaN)).to.be.eql()
      expect(utils.getContentType(Number.POSITIVE_INFINITY)).to.be.eql()
    })
    it('should return application/json for array', () => {
      expect(utils.getContentType([])).to.be.eql('application/json')
      expect(utils.getContentType([1, 2])).to.be.eql('application/json')
      expect(utils.getContentType(['a', 'b'])).to.be.eql('application/json')
    })
  })
})
