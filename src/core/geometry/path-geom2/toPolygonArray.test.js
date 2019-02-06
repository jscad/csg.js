const equals = require('./equals')
const flip = require('./flip')
const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')
const toPolygonArray = require('./toPolygonArray')
const transform = require('./transform')

const polygon = fromPolygonArray({}, [[[0, 1], [0, 0], [2, 0], [2, 1]]])

test('toPolygonArray: Roundtrip ', t => {
  t.true(equals(fromPolygonArray({}, toPolygonArray({}, polygon)), polygon))
})

test('toPolygonArray: Flipped polygons are wound backward ', t => {
  t.true(equals(fromPolygonArray({ flipped: true }, toPolygonArray({}, flip(polygon))), flip(polygon)))
})
