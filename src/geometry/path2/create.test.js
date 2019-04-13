const test = require('ava')

const create = require('./create')
const equals = require('./equals')
const fromPoints = require('./fromPoints')

test('create: Creates an empty path', t => {
  t.true(equals(create(), fromPoints({ closed: false }, [])))
})
