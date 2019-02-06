const canonicalize = require('./canonicalize')
const { degToRad } = require('../../math/utils')
const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const fromZRotation = require('../../math/mat4/fromZRotation')
const test = require('ava')
const transform = require('./transform')
const union = require('./union')

const rectangle = fromPolygonArray({}, [[[0, 1], [0, 0], [2, 0], [2, 1]]])

test('transform: Rotation by 90 degrees works', t => {
  t.true(equals(transform(fromZRotation(degToRad(90)), rectangle),
                fromPolygonArray({}, [[[-1,0],[0,0],[0,2],[-1,2]]])))
})
