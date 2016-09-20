const transformConfig = require('../../../../lib/transformConfig')

describe('transformConfig', () => {
  it('should check config existance', () => {
    expect(() => transformConfig()).to.throw()
  })
  it('should check connection field', () => {
    expect(() => transformConfig({})).to.throw()
  })
  it('should transofrm connection string into object with uri', () => {
    expect(transformConfig({connection: 'zzz'}).connection).to.eql({uri: 'zzz'})
  })
  it('should pass connection object', () => {
    const config = {connection: {}}
    expect(transformConfig(config).connection).to.be.eql(config.connection)
  })
  it('should return default config for valid empty config', () => {
    expect(transformConfig({connection: 'zzz'})).to.be.eql({
      connection: {uri: 'zzz'},
      exchanges: [], queues: [], bindings: []
    })
  })

  // Request - Response
  it('should transofrm req config', () => {
    expect(transformConfig({connection: 'zzz', req: 'test'}))
    .to.be.eql({
      connection: {uri: 'zzz'},
      exchanges: [{name: 'req-res.test', replyTimeout: 10000, type: 'direct'}],
      queues: [], bindings: []
    })
  })
  it('should transofrm res config', () => {
    expect(transformConfig({connection: 'zzz', res: 'test'}))
    .to.be.eql({
      connection: {uri: 'zzz'},
      exchanges: [{name: 'req-res.test', replyTimeout: 10000, type: 'direct'}],
      queues: [{name: 'req-res.test', subscribe: true}], bindings: [{
        exchange: 'req-res.test',
        target: 'req-res.test',
        keys: 'test'
      }]
    })
  })

  // Send - Receive
  it('should transofrm req config', () => {
    expect(transformConfig({connection: 'zzz', send: 'test'}))
    .to.be.eql({
      connection: {uri: 'zzz'},
      exchanges: [{name: 'send-recv.test', replyTimeout: 10000, type: 'direct'}],
      queues: [], bindings: []
    })
  })
  it('should transofrm recv config', () => {
    expect(transformConfig({connection: 'zzz', recv: 'test'}))
    .to.be.eql({
      connection: {uri: 'zzz'},
      exchanges: [{name: 'send-recv.test', replyTimeout: 10000, type: 'direct'}],
      queues: [{name: 'send-recv.test', subscribe: true}], bindings: [{
        exchange: 'send-recv.test',
        target: 'send-recv.test',
        keys: 'test'
      }]
    })
  })
  it('should process array and non array equals', () => {
    expect(transformConfig({connection: 'zzz', req: 'test'})).to.be.eql(transformConfig({connection: 'zzz', req: ['test']}))
    expect(transformConfig({connection: 'zzz', res: 'test'})).to.be.eql(transformConfig({connection: 'zzz', res: ['test']}))
    expect(transformConfig({connection: 'zzz', send: 'test'})).to.be.eql(transformConfig({connection: 'zzz', send: ['test']}))
    expect(transformConfig({connection: 'zzz', recv: 'test'})).to.be.eql(transformConfig({connection: 'zzz', recv: ['test']}))
  })
})
