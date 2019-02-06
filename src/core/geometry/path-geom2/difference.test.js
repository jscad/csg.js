const { degToRad } = require('../../math/utils')
const difference = require('./difference')
const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const fromTranslation = require('../../math/mat4/fromTranslation')
const fromZRotation = require('../../math/mat4/fromZRotation')
const test = require('ava')
const transform = require('./transform')

const rectangle = fromPolygonArray({}, [[[0, 1], [0, 0], [2, 0], [2, 1]]])

test('difference: Difference of no geometries produces an empty geometry', t => {
  t.true(equals(difference(), fromPolygonArray({}, [])));
})

test('difference: Difference of one geometry produces that geometry', t => {
  t.true(equals(difference(rectangle), rectangle))
})

test('difference: Difference of rectangle with itself produces an empty geometry', t => {
  t.true(equals(difference(rectangle, rectangle), fromPolygonArray({}, [])));
})

test('difference: Difference of rectangle with itself rotated 90 degrees produces L', t => {
  t.true(equals(difference(rectangle, transform(fromZRotation(degToRad(90)), rectangle)),
                fromPolygonArray({}, [[[0, 0], [2, 0], [2, 1], [0, 1]]])))
})
