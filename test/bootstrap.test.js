const chai = require('chai')
require('sinon')
const sinonChai = require('sinon-chai')
const chaiAsPromised = require('chai-as-promised')
const bluebird = require('bluebird')
require('sinon-as-promised')(bluebird)
chai.use(chaiAsPromised)
chai.use(sinonChai)
global.expect = chai.expect
