const create = require('./create')
const fromPoints = require('./fromPoints')
const measureBoundingSphere = require('./measureBoundingSphere')
const mat4 = require('../mat4')
const test = require('ava')
const transform = require('./transform')
const vec3 = require('../vec3')

const empty = create()
const triangle = fromPoints([[0, 0, 0], [0, 10, 0], [0, 10, 10]])
const square = fromPoints([[0, 0, 0], [0, 10, 0], [0, 10, 10], [0, 0, 10]])
const vShape = fromPoints([[0, 3, 0], [0, 5, 0], [0, 8, 2], [0, 6, 5],
                           [0, 8, 6], [0, 5, 6], [0, 5, 2], [0, 2, 5],
                           [0, 1, 3], [0, 3, 3]])

test('poly3: bounding sphere of empty', (t) => {
  t.deepEqual(measureBoundingSphere(empty), [vec3.fromValues(0, 0, 0), 0])
})

test('poly3: bounding sphere of triangle', (t) => {
  t.deepEqual(measureBoundingSphere(triangle), [vec3.fromValues(0, 5, 5), 7.0710678118654755])
})

test('poly3: bounding sphere of square', (t) => {
  t.deepEqual(measureBoundingSphere(square), [vec3.fromValues(0, 5, 5), 7.0710678118654755])
})

test('poly3: bounding sphere of v-shape', (t) => {
  t.deepEqual(measureBoundingSphere(vShape), [vec3.fromValues(0, 5, 3), 4.242640687119285])
})

const rotation = mat4.fromZRotation((45 * 0.017453292519943295))

test('poly3: bounding sphere of rotated empty', (t) => {
  t.deepEqual(measureBoundingSphere(transform(rotation, empty)), [vec3.fromValues(0, 0, 0), 0])
})

test('poly3: bounding sphere of rotated triangle', (t) => {
  t.deepEqual(measureBoundingSphere(transform(rotation, triangle)),
              [vec3.fromValues(-7.071070194244385, 3.5355350971221924, 5), 9.354145718071434])
})

test('poly3: bounding sphere of rotated square', (t) => {
  t.deepEqual(measureBoundingSphere(transform(rotation, square)),
              [vec3.fromValues(-7.071070194244385, 3.5355350971221924, 5), 9.354145718071434])
})

test('poly3: bounding sphere of rotated v shape', (t) => {
  t.deepEqual(measureBoundingSphere(transform(rotation, vShape)),
              [vec3.fromValues(-6.01040506362915, 3.5355348587036133, 3), 6.451737440533223])
})
