const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')
const toPolygonArray = require('./toPolygonArray')

const trianglePoints = [[0, 0, 0], [0, 1, 0], [0, 1, 1]]

test('Convert from PolygonArray to solid to maching PolygonArray', t => {
  const triangle = fromPolygonArray({}, [trianglePoints])
  t.deepEqual(toPolygonArray({}, triangle), [trianglePoints])
})
