module.exports = {
  appendPoint: require('./appendPoint'),
  canonicalize: require('./canonicalize'),
  close: require('./close'),
  concat: require('./concat'),
  create: require('./create'),
  eachPoint: require('./eachPoint'),
  equals: require('./equals'),
  fromPointArray: require('./fromPointArray'),
  reverse: require('./reverse'),
  toPointArray: require('./toPointArray'),
  transform: require('./transform')
}

// Register an instance of this geometry with this implementation.
const call = require('../../api/registry/call')
const create = require('./create')

call(create(), module.exports)
