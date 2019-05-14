const test = require('ava')

const {degToRad} = require('../../math/utils')

const {mat4, vec3} = require('../../math')

const {geom2, geom3, poly3} = require('../../geometry')

const {circle} = require('../../primitives')

const extrudeFromSlices = require('./extrudeFromSlices')

const comparePolygonsAsPoints = require('../../../test/helpers/comparePolygonsAsPoints')

test('extrudeFromSlices (defaults)', t => {
  let geometry2 = geom2.fromPoints([[10, 8], [10, -8], [26, -8], [26, 8]])

  let geometry3 = extrudeFromSlices({}, geometry2)
  let pts = geom3.toPoints(geometry3)
  let exp = [
    [[0, 1, 0], [1, 1, 0], [1, 0, 0], [0, 0, 0], ],
    [[0, 0, 1], [0, 0, 0], [1, 0, 0], ],
    [[1, 0, 1], [0, 0, 1], [1, 0, 0], ],
    [[1, 0, 1], [1, 0, 0], [1, 1, 0], ],
    [[1, 1, 1], [1, 0, 1], [1, 1, 0], ],
    [[1, 1, 1], [1, 1, 0], [0, 1, 0], ],
    [[0, 1, 1], [1, 1, 1], [0, 1, 0], ],
    [[0, 1, 1], [0, 1, 0], [0, 0, 0], ],
    [[0, 0, 1], [0, 1, 1], [0, 0, 0], ],
    [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1], ]
  ]
  t.is(pts.length, 10)
  t.true(comparePolygonsAsPoints(pts, exp))
})

test('extrudeFromSlices (torus)', t => {
  var sqrt3 = Math.sqrt(3) / 2;
  var radius = 10;

  var hex = poly3.fromPoints([
    [radius, 0, 0],
    [radius / 2, radius * sqrt3, 0],
    [-radius / 2, radius * sqrt3, 0],
    [-radius, 0, 0],
    [-radius / 2, -radius * sqrt3, 0],
    [radius / 2, -radius * sqrt3, 0]
  ]);
  hex = poly3.transform(mat4.fromTranslation([0, 20, 0]), hex)

  var angle = 45;
  let geometry3 = extrudeFromSlices(
    {
      numslices: 360 / angle,
      loop: true,
      callback: function(t, slice) {
        return poly3.transform(mat4.fromXRotation(degToRad(angle * slice)), this)
      }
    }, hex
  )
  let pts = geom3.toPoints(geometry3)
  t.is(pts.length, 96)
})

test('extrudeFromSlices (same shape, changing dimensions)', t => {
  const base = poly3.fromPoints([ [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0] ])
  let geometry3 = extrudeFromSlices(
    {
      numslices: 4,
      callback: function(t, count) {
        let slice = poly3.transform(mat4.fromTranslation([0, 0, count * 2]), this)
        slice = poly3.transform(mat4.fromScaling([1 + count, 1 + (count/2), 1]), slice)
        return slice
      }
    }, base
  )
  let pts = geom3.toPoints(geometry3)
  t.is(pts.length, 26)
})

test('extrudeFromSlices (changing shape, changing dimensions)', t => {
  const base = circle({radius: 4, resolution: 4})
  let geometry3 = extrudeFromSlices(
    {
      numslices: 5,
      callback: function(t, count) {
        let points = geom2.toPoints(circle({radius: 5+count, resolution: 4+count}))
        let slice = poly3.fromPoints(points.map((p) => vec3.fromVec2(p)))
        slice = poly3.transform(mat4.fromTranslation([0, 0, count * 10]), slice)
        return slice
      }
    }, base
  )
  let pts = geom3.toPoints(geometry3)
  t.is(pts.length, 50)
})
