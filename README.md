# RabRPC
[![npm version](https://badge.fury.io/js/rabrpc.svg)](https://badge.fury.io/js/rabrpc)
[![Build Status](https://travis-ci.org/swarthy/rabrpc.svg?branch=master)](https://travis-ci.org/swarthy/rabrpc)
[![Dependencies Status](https://david-dm.org/swarthy/rabrpc.svg)]()
[![Known Vulnerabilities](https://snyk.io/test/npm/rabrpc/badge.svg)](https://snyk.io/test/npm/rabrpc)

Another RPC library based on [RabbitMQ](http://www.rabbitmq.com/) (through [rabbot](https://github.com/arobson/rabbot))

> WARNING: This project is currently in its ALPHA stage!

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

##### rpc.initialize(config, [transformConfig = true])
 * `config` - rabrpc or rabbot config object
 * `transformConfig` - if `config` is a rabbot setting `transformConfig` must be false, default true

###### rabbot json configuration

If you need more flexibility, you can pass a valid rabbot configuration into `rpc.initialize`
The only requirement is name exchanges, queues and bindings with [convention](#convention)
```javascript
const config = {
  connection: {
    user: "guest",
    pass: "guest",
    server: "127.0.0.1",
    // server: "127.0.0.1, 194.66.82.11",
    // server: ["127.0.0.1", "194.66.82.11"],
    port: 5672,
    timeout: 2000,
    vhost: "%2fmyhost"
  },
  exchanges:[
    { name: "config-ex.1", type: "fanout", publishTimeout: 1000 },
    { name: "config-ex.2", type: "topic", alternate: "alternate-ex.2", persistent: true },
    { name: "dead-letter-ex.2", type: "fanout" }
  ],
  queues:[
    { name:"config-q.1", limit: 100, queueLimit: 1000 },
    { name:"config-q.2", subscribe: true, deadLetter: "dead-letter-ex.2" }
  ],
  bindings:[
    { exchange: "config-ex.1", target: "config-q.1", keys: [ "bob","fred" ] },
    { exchange: "config-ex.2", target: "config-q.2", keys: "test1" }
  ],
}

rpc.initialize(config, false) // transform config = false
```


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

#### Convention

| Parmeter        | Value                            | Example                        |
| --------------- | -------------------------------- | ------------------------------ |
| **exchange**    | req.res-`serviceName`            | req.res-foo-service-name       |
| **queue**       | req.res-`serviceName`            | req.res-foo-service-name       |
| **routingKey**  | `serviceName`                    | foo-service-name               |
| **messageType** | `version`.`serviceName`.`action` | v1.foo-service-name.someAction |

##### Response
###### rpc.respond(messageType, handler)
 * `messageType` - full path for service action, e.g. `'v1.images.resize'` or `'v1.users.role.findAll'` where **second** part (`images`, `users`) is a serviceName specified in config (in rabbot using as type of message)
 * `handler` - function, which takes `payload`, `responseActions` and `messageType`
   * `payload` - parameter from rpc.request
   * `responseActions` - object with 3 functions `success`, `fail`, `error` (see [JSEND](https://github.com/Prestaul/jsend))
   * `messageType` - type of rabbot message (usefull when listening for types, which contain `*` or `#`)

###### Example

```javascript
const rpc = require('rabrpc')

// before initialization
rpc.respond('v1.foo-service-name.someAction', (payload, actions, messageType) => actions.success(payload * 2))

// handler can aslo just return promise, or `.then`able or value and result will be replied with success status
// exception or rejected promise will cause replying error (be sure throw `Error` with message (JSEND requirement))

rpc.respond('v1.foo-service-name.anotherAction', payload => SomeDB.query({/* ... */}).then(rows => ({count: rows.count, data: rows})))
rpc.respond('v1.foo-service-name.anotherAction', payload => payload * 2)

rpc.respond('v1.foo-service-name.someResource.*', (payload, actions, messageType) => {
  const [version, serviceName, resource, actionName] = messageType.split('.')
  switch (actionName) {
    case 'find':
      return Resource.findAll(paylaod)
    case 'create':
      return Resource.create(payload)
    case 'destroy':
      return Resource.destroy(payload)
    default:
      throw new Error(`Action '${actionName}' is not supported!`)
  }
})

// in your service initialization cycle
rpc.initialize(config)

```

##### Request
###### rpc.request(messageType, payload, [options])
 * `messageType` - see `rpc.respond` *messageType* argument
 * `payload` - payload data, which will passed into respond handler (see above) (can be any JSON serializable value)
 * `options` - rabbot request options (will be merged with defaults: `{replyTimeout: 10000}`)

returns `Promise`, which resolved with 2 element array: `[body, actions]`
 * `body` JSEND formated repose (see [JSEND](https://github.com/Prestaul/jsend))
 * `actions` rabbot message actions: ack, nack, reject (see https://github.com/arobson/rabbot#message-api)

###### Example

```javascript
const rpc = require('rabrpc')

// request allowed only after initialization
rpc.initialize(config)
.then(() => rpc.request('v1.foo-service-name.someAction', 42))
.then(body => {
  console.log('response:', body.data) // body = {status: 'succes', data: 84}
})

```
