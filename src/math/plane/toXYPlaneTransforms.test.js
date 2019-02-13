const poly3 = require('../../core/geometry/poly3')
const quantizeForSpace = require('../utils/quantizeForSpace')
const test = require('ava')
const toXYPlaneTransforms = require('./toXYPlaneTransforms')

// FIX: Remove q when quantized poly3 is available.
const q = p => p.vertices.map(v => v.map(quantizeForSpace))

test('Polygon in XY plane is unaffected by transform to XY plane', t => {
  const points = [[0, 0, 0], [1, 0, 0], [1, 1, 0]]
  const polygon = poly3.fromPoints(points)
  const toXYPlane = toXYPlaneTransforms(polygon.plane).toXYPlane
  t.deepEqual(q(poly3.transform(toXYPlane, polygon)),
              q(polygon))
})

test('Polygon out of XY plane is transformed into XY plane', t => {
  const points = [[0, 0, 0], [1, 0, 1], [1, 1, 2]]
  const polygon = poly3.fromPoints(points)
  const toXYPlane = toXYPlaneTransforms(polygon.plane).toXYPlane
  t.deepEqual(q(poly3.transform(toXYPlane, polygon))
              [[0, 0, 0],
               [1.2247447967529297, 0.7071067690849304, 0],
               [1.2247447967529297, 2.1213202476501465, 0]])
})

test('Polygon out of XY plane is transformed into XY plane and back again', t => {
  const points = [[0, 0, 0], [1, 0, 1], [1, 1, 2]]
  const polygon = poly3.fromPoints(points)
  const { fromXYPlane, toXYPlane } = toXYPlaneTransforms(polygon.plane)
  t.deepEqual(q(poly3.transform(fromXYPlane, poly3.transform(toXYPlane, polygon))),
              q(polygon))
})
