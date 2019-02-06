const fromPointArray = require('./fromPointArray')
const toPointArray = require('./toPointArray')
const test = require('ava')
const vec2 = require('../../math/vec2')

test('fromPointArray: Creating a path from no points produces an empty, canonical path', t => {
  const created = fromPointArray({}, [])
  t.true(created.isCanonicalized)
  t.deepEqual(toPointArray({}, created), [])
})

test('fromPointArray: Creating a path from one point produces a non-canonical path with that element', t => {
  const created = fromPointArray({}, [[1, 1]])
  t.false(created.isCanonicalized)
  t.deepEqual(toPointArray({}, created), [vec2.fromValues(1, 1)])
})

test('fromPointArray: Creating a closed path from one point produces a closed non-canonical path with that element', t => {
  const created = fromPointArray({ closed: true }, [[1, 1]])
  t.true(created.isClosed)
  t.false(created.isCanonicalized)
  t.deepEqual(toPointArray({}, created), [vec2.fromValues(1, 1)])
})
