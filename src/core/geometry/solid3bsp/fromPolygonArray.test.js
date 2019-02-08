const create = require('./create')
const difference = require('./difference')
const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const fromPoly3Array = require('./fromPoly3Array')
const poly3 = require('../poly3')
const test = require('ava')
const toPolygonArray = require('./toPolygonArray')
const vec3 = require('../../math/vec3')

const trianglePoints = [[0, 0, 0], [0, 1, 0], [0, 1, 1]]

test('Can convert from PolygonArray to solid to matching PolygonArray', t => {
  t.deepEqual(toPolygonArray({}, fromPolygonArray({}, [trianglePoints])),
              [trianglePoints])
})
