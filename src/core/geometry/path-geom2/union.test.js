const { degToRad } = require('../../math/utils')
const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const fromZRotation = require('../../math/mat4/fromZRotation')
const test = require('ava')
const transform = require('./transform')
const union = require('./union')

const rectangle = fromPolygonArray({}, [[[0, 1], [0, 0], [2, 0], [2, 1]]])

test('union: Union of no geometries produces an empty geometry', t => {
  t.true(equals(union(), fromPolygonArray({}, [])));
})

test('union: Union of one geometry produces that geometry', t => {
  t.true(equals(union(rectangle), rectangle));
})

test('union: Union of rectangle with itself produces itself', t => {
  t.true(equals(union(rectangle, rectangle), rectangle));
})

test('union: Union of rectangle with itself rotated 90 degrees produces L', t => {
  t.true(equals(union(rectangle, transform(fromZRotation(degToRad(90)), rectangle)),
                fromPolygonArray({}, [[[-1, 0], [2, 0], [2, 1], [0, 1], [0, 2], [-1, 2]]])))
})
