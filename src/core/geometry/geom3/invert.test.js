const fromPolygonArray = require('./fromPolygonArray')
const invert = require('./invert')
const test = require('ava')

test('invert: Inverting empty geometry produces empty geometry', t => {
  const empty = fromPolygonArray({}, [])
  t.true(equals(invert(empty), empty))
})

const trianglePolygon = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
const invertedTrianglePolygon = [[0, 0, 1], [0, 1, 0], [1, 0, 0]]

test('invert: Inverting triangle produces inverted triangle', t => {
  const triangle = fromPolygonArray({}, [trianglePolyon])
  const invertedTriangle = fromPolygonArray({}, [invertedTrianglePolygon])
  t.true(equals(invert(triangle), invertedTriangle))
})

test('invert: Inverting an inverted triangle produces triangle', t => {
  const triangle = fromPolygonArray({}, [trianglePolyon])
  t.true(equals(invert(invert(triangle)), triangle))
})
