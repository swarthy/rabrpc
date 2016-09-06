const rpc = require('../index')

let processed = 0

const handler = (number, actions) => {
  if (++processed % 500 === 0) {
    console.log(processed, 'processed')
  }
  // if (Math.random() >= 0.5) {
  //   return Promise.reject(new Error('Some error'))
  // } else {
  //   return message.reply({payload: message.body.payload * 2})
  // }
  return actions.success(number * 2)
}

const config = {
  connection: 'amqp://guest:guest@localhost:5672/?heartbeat=10',
  res: {
    serviceName: 'service-name',
    noBatch: true,
    limit: 200
  }
}

rpc.initialize(config)
.then(() => rpc.respond('v1.service-name.action', handler))
.catch(err => console.error(err))
