const create = require('./create')
const difference = require('./difference')
const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const fromPoly3Array = require('./fromPoly3Array')
const poly3 = require('../poly3')
const test = require('ava')
const toPolygonArray = require('./toPolygonArray')
const vec3 = require('../../math/vec3')

const trianglePoints = [vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 1, 1)]
const trianglePoly = poly3.fromPoints(trianglePoints)

test('difference: Difference of zero solids is empty solid', t => {
  t.deepEqual(toPolygonArray({}, fromPoly3Array([trianglePoly])), [trianglePoints])
})
