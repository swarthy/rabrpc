const buildConfig = require('../../../lib/buildConfig')

function cfg (config) {
  return Object.assign({connection: 'localhost'}, config)
}

describe('buildConfig', () => {
  describe('expections and defaults', () => {
    it('should throw error if no config options', () => {
      expect(() => buildConfig()).to.throw(/config is required/)
    })
    it('should throw error if connection is undefined', () => {
      expect(() => buildConfig({})).to.throw(/connection option is required/)
    })
    it('should return default cfg for empty config', () => {
      expect(buildConfig(cfg())).to.be.eql({connection: {uri: 'localhost'}, exchanges: [], queues: [], bindings: []})
    })
  })
  describe('Requester', () => {
    it('should configure request exchange', () => {
      expect(buildConfig(cfg({req: 'test'}))).to.be.eql({
        connection: {
          uri: 'localhost'
        },
        exchanges: [{name: 'req-res.test', type: 'direct'}],
        queues: [],
        bindings: []
      })
    })
    it('should process array', () => {
      expect(buildConfig(cfg({req: ['test1', 'test2']})).exchanges).to.be.eql([
        {name: 'req-res.test1', type: 'direct'},
        {name: 'req-res.test2', type: 'direct'}
      ])
    })
  })
  describe('Responder', () => {
    it('should configure respond exchange, queue and binding', () => {
      expect(buildConfig(cfg({res: 'test'}))).to.be.eql({
        connection: {
          uri: 'localhost'
        },
        exchanges: [{name: 'req-res.test', type: 'direct'}],
        queues: [{name: 'req-res.test', subscribe: true}],
        bindings: [{
          exchange: 'req-res.test',
          target: 'req-res.test',
          keys: 'test'
        }]
      })
    })
    it('should extend queue', () => {
      expect(buildConfig(cfg({res: {serviceName: 'test', limit: 10}})).queues).to.be.eql([{
        name: 'req-res.test',
        subscribe: true,
        limit: 10
      }])
    })
    it('should throw exception if serviceName is no exist', () => {
      expect(() => buildConfig(cfg({res: {limit: 10}}))).to.throw(/serviceName is required/)
    })
  })
})
