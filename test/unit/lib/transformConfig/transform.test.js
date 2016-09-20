const Transform = require('../../../../lib/transformConfig/transform')

const sinon = require('sinon')

const parseExchange = sinon.stub().returns({name: 'exchange'})
const parseQueue = sinon.stub().returns({name: 'queue'})
let cfg = {}

describe('transformConfig', () => {
  beforeEach(() => {
    cfg = {exchanges: [], queues: [], bindings: []}
    parseExchange.reset()
    parseQueue.reset()
  })
  describe('transformProducer', () => {
    it('should merge cfg and config', () => {
      Transform.transformProducer(cfg, 'test', parseExchange)
      expect(parseExchange).to.have.been.calledWithMatch({serviceName: 'test'}, true)
      expect(parseQueue).to.have.not.been.called
      expect(cfg.exchanges[0]).to.be.ok
      expect(cfg.exchanges[0].name).to.be.eql('exchange')
      expect(cfg.queues).to.be.eql([])
      expect(cfg.bindings).to.be.eql([])
    })
  })
  describe('transformConsumer', () => {
    it('should merge cfg and config', () => {
      Transform.transformConsumer(cfg, 'test', parseExchange, parseQueue)
      expect(parseExchange).to.have.been.calledWithMatch({serviceName: 'test'})
      expect(parseQueue).to.have.been.calledWithMatch({serviceName: 'test'})
      expect(cfg.exchanges[0]).to.be.ok
      expect(cfg.exchanges[0].name).to.be.eql('exchange')
      expect(cfg.queues[0]).to.be.ok
      expect(cfg.queues[0].name).to.be.eql('queue')
      expect(cfg.bindings[0]).to.be.ok
      expect(cfg.bindings[0]).to.be.eql({
        exchange: 'exchange',
        target: 'queue',
        keys: 'test'
      })
    })
  })
})
