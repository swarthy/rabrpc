const ReqRes = require('../../../../../lib/transformConfig/req-res')

describe('transformConfig req-res transformReq', () => {
  it('should merge cfg and req config', () => {
    const cfg = {exchanges: [], queues: [], bindings: []}
    ReqRes.transformReq(cfg, 'test')
    expect(cfg.exchanges[0]).to.be.ok
    expect(cfg.exchanges[0].name).to.be.eql('req-res.test')
    expect(cfg.queues).to.be.eql([])
    expect(cfg.bindings).to.be.eql([])
  })
})

describe('transformConfig req-res transformRes', () => {
  it('should merge cfg and req config', () => {
    const cfg = {exchanges: [], queues: [], bindings: []}
    ReqRes.transformRes(cfg, 'test')
    expect(cfg.exchanges[0]).to.be.ok
    expect(cfg.exchanges[0].name).to.be.eql('req-res.test')
    expect(cfg.queues[0]).to.be.ok
    expect(cfg.queues[0].name).to.be.eql('req-res.test')
    expect(cfg.queues[0].subscribe).to.be.ok
    expect(cfg.bindings[0]).to.be.ok
    expect(cfg.bindings[0]).to.be.eql({
      exchange: 'req-res.test',
      target: 'req-res.test',
      keys: 'test'
    })
  })
})
