const test = require('ava')

const vec2 = require('../../math/vec2')

const {fromPoints, toPoints} = require('./index')

test('fromPoints: Creating a path from no points produces an empty non-canonical path', t => {
  const created = fromPoints({}, [])
  t.false(created.isCanonicalized)
  t.deepEqual(toPoints(created), [])
})

test('fromPoints: Creating a path from one point produces a non-canonical path with that element', t => {
  const created = fromPoints({}, [[1, 1, 0]])
  t.false(created.isCanonicalized)
  t.deepEqual(toPoints(created), [vec2.fromValues(1, 1)])
})

test('fromPoints: Creating a closed path from one point produces a closed non-canonical path with that element', t => {
  const created = fromPoints({ closed: true }, [[1, 1, 0]])
  t.true(created.isClosed)
  t.false(created.isCanonicalized)
  t.deepEqual(toPoints(created), [vec2.fromValues(1, 1)])
})
