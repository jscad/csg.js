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
const trianglePoly = poly3.fromPoints(trianglePoints)

test('Can convert from Poly3Array to solid to maching points', t => {
  t.deepEqual(toPolygonArray({}, fromPoly3Array([trianglePoly])),
              [trianglePoints])
})
