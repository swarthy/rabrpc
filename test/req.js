const rpc = require('../index')

const requestData = [...Array(5000).keys()]

let processed = 0

function request (data) {
  return rpc.request('v1.service-name.action', data)
  .then(([body, actions]) => {
    if (body.data !== data * 2) {
      throw new Error(`result: ${body.payload} expected: ${data * 2}`)
    } else {
      if (++processed % 500 === 0) {
        console.log(processed, 'responded')
      }
      return actions.ack()
    }
  })
  .catch(err => console.error(err))
}

const config = {
  connection: 'amqp://guest:guest@localhost:5672/?heartbeat=10',
  req: 'service-name'
}

rpc.initialize(config)
.then(() => Promise.all(requestData.map(request)))
.then(() => console.log('SHUT DOWN'))
.catch(err => console.error(err))
.then(() => rpc.shutdown())
