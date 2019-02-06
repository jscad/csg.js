const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const fromTranslation = require('../../math/mat4/fromTranslation')
const intersection = require('./intersection')
const test = require('ava')
const transform = require('./transform')

const rectangle = fromPolygonArray({}, [[[0, 1], [0, 0], [2, 0], [2, 1]]])

test('union: Intersection of no geometries produces an empty geometry', t => {
  // Demonstratate 
  t.true(equals(intersection(), fromPolygonArray({}, [])))
})

test('union: Intersection of one geometry produces that geometry', t => {
  // Demonstratate 
  t.true(equals(intersection(rectangle), rectangle));
})

test('union: Intersection of rectangle with itself produces itself', t => {
  // Demonstratate 
  t.true(equals(intersection(rectangle, rectangle), rectangle))
})

test('union: Intersection of rectangle with itself translated by one produces square', t => {
  // Demonstratate 
  t.true(equals(intersection(rectangle, transform(fromTranslation([-1, 0, 0]), rectangle)),
                fromPolygonArray({}, [[[0,0],[1,0],[1,1],[0,1]]])))
})
