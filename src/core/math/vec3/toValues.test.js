const fromValues = require('./fromValues')
const test = require('ava')
const toValues = require('./toValues')

test('vec3: vec3 round-trips via values', t => {
  const values = [1, 2, 3]
  t.deepEqual(toValues(fromValues(values)), values)
})
