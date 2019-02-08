const clone = require('./clone')
const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')

// A simple triangle.
const triangle = [[0, 0, 0], [0, 1, 0], [0, 1, 1]]

test('Empty solid is distinct from but the same as its clone', (t) => {
  const solid = fromPolygonArray({}, [])
  const cloned = clone(solid)
  t.deepEqual(solid, cloned)
  t.not(solid, cloned)
})

test('Non-empty solid is distinct from but the same as its clone', (t) => {
  const solid = fromPolygonArray({}, [triangle])
  const cloned = clone(solid)
  t.deepEqual(solid, cloned)
  t.not(solid, cloned)
})
