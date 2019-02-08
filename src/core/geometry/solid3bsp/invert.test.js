const fromPolygonArray = require('./fromPolygonArray')
const equals = require('./equals')
const invert = require('./invert')
const test = require('ava')

const trianglePoints = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
const invertedTrianglePoints = [[0, 0, 1], [0, 1, 0], [1, 0, 0]]

test('Inverting empty geometry produces empty geometry', t => {
  const empty = fromPolygonArray({}, [])
  t.true(equals(invert(empty), empty))
})

test('Inverting triangle produces inverted triangle', t => {
  const triangle = fromPolygonArray({}, [trianglePoints])
  const invertedTriangle = fromPolygonArray({}, [invertedTrianglePoints])
  t.true(equals(invert(triangle), invertedTriangle))
})

test('Inverting an inverted triangle produces triangle shared', t => {
  const triangle = fromPolygonArray({}, [trianglePoints])
  t.true(equals(invert(invert(triangle)), triangle))
})
