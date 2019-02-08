const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')
const toPolygonArray = require('./toPolygonArray')

const trianglePoints = [[0, 0, 0], [0, 1, 0], [0, 1, 1]]

test('Can convert from PolygonArray to solid to matching PolygonArray', t => {
  t.deepEqual(toPolygonArray({}, fromPolygonArray({}, [trianglePoints])),
              [trianglePoints])
})
