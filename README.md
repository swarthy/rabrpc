# RabRPC
[![Build Status](https://travis-ci.org/swarthy/rabrpc.svg?branch=master)](https://travis-ci.org/swarthy/rabrpc)
[![Dependencies Status](https://david-dm.org/swarthy/rabrpc.svg)]()

Another RPC library based on [RabbitMQ](http://www.rabbitmq.com/) (through [rabbot](https://github.com/arobson/rabbot))

> WARNING: This project is currently in its BETA stage!

## Features

 * Promise-based interface (thanks [rabbot](https://github.com/arobson/rabbot))
 * Convention over configuration in exchange, queue, routingKeys naming

The only listed below producer/consumer patterns are implemented now:
* [x] Request / Response
* [ ] Publish / Subscribe
* [ ] Send / Receive

## Installation
```bash
npm install --save rabrpc
```

## Examples

### Request / Response

#### Initialization

> Important! `rpc.initialize` *should* be called **after** binding handlers via `rpc.respond` in consumer microservice and *must* be called **before** requesting data with `rpc.request` in provider microservice


##### Responder initialization

```javascript
const rpc = require('rabrpc') // singleton

const config = {
  // uri
  connection: 'amqp://guest:guest@localhost:5672/?heartbeat=10',
  // or object passed to rabbot see https://github.com/arobson/rabbot#configuration-via-json
  // connection: {user: 'guest', pass: 'guest', server: 'localhost', ...}
  
  // respond configuration in consumer microservice
  // this config will create exchange(s), queue(s) and binding(s)
  // request configation in provider microservice only create exchange(s)

  res: { // string or object or array of strings or objects
    serviceName: 'foo-service-name',
    // rabbot queue options, see https://github.com/arobson/rabbot#addqueue-queuename-options-connectionname-
    // subscribe: true is default
    messageTtl: 30000,
    limit: 10,
    // ...etc
  }
}

// somewhere in your microservice initialization cycle
rpc.initialize(config) // returns promise

```

##### Requester initialization

```javascript
const rpc = require('rabrpc') // singleton

const config = {
  connection: '<URI string>', // see above

  // requesting resource configuration
  // this config will create only exchange(s)
  // respond configuration in consumer microservice will create queue(s) and binding(s)

  // req: 'foo-service-name' | ['foo-service-name', 'bar-service-name'] | {serviceName: 'foo-service-name'} | [{serviceName: 'foo-service-name'}, {serviceName: 'bar-service-name'}]
  req: 'foo-service-name'
}

// somewhere in your microservice initialization cycle
rpc.initialize(config) // returns promise

```

### Convention

| Parmeter        | Value                            | Example                        |
| --------------- | -------------------------------- | ------------------------------ |
| **exchange**    | req.res-`serviceName`            | req.res-foo-service-name       |
| **queue**       | req.res-`serviceName`            | req.res-foo-service-name       |
| **routingKey**  | `serviceName`                    | foo-service-name               |
| **messageType** | `version`.`serviceName`.`action` | v1.foo-service-name.someAction |

##### Response
###### rpc.respond(messageType, handler)
 * **messageType** full path for service action, e.g. `'v1.images.resize'` or `'v1.users.role.findAll'` where **second** part (`images`, `users`) is a serviceName specified in config (in rabbot using as type of message)
 * **handler** function, which takes `payload` and `responseActions`
   * **payload** parameter from rpc.request
   * **responseActions** object with 3 functions `success`, `fail`, `error` (see [JSEND](https://github.com/Prestaul/jsend))

###### Example

```javascript
const rpc = require('rabrpc')

// before initialization
rpc.respond('v1.foo-service-name.someAction', (payload, actions) => actions.success(payload * 2))

// in your service initialization cycle
rpc.initialize(config)

```

##### Request
###### rpc.request(messageType, payload, [options])
 * **messageType** see `rpc.respond` *messageType* argument
 * **payload** payload data, which will passed into respond handler (see above) (can be any JSON serializable value)
 * **options** rabbot request options (will be merged with defaults: `{replyTimeout: 10000}`)

returns `Promise`, which resolved with 2 element array: `[body, actions]`
 * **body** JSEND formated repose (see [JSEND](https://github.com/Prestaul/jsend))
 * **actions** 3 rabbot message actions: ack, nack, reject (see https://github.com/arobson/rabbot#message-api)

> Why only 3? Who knows?!

###### Example

```javascript
const rpc = require('rabrpc')

// request allowed only after initialization
rpc.initialize(config)
.then(() => rpc.request('v1.foo-service-name.someAction', 42))
.then(([body, actions]) => {
  console.log('response:', body.data) // body = {status: 'succes', data: 84}
  return actions.ack() // let responder know that reponse received (what?)
})

```

