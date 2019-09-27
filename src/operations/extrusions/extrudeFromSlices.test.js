const test = require('ava')

const { degToRad } = require('../../math/utils')

const { mat4 } = require('../../math')

const { geom2, geom3, poly3 } = require('../../geometry')

const { circle } = require('../../primitives')

const extrudeFromSlices = require('./extrudeFromSlices')
const slice = require('./slice')

const comparePolygonsAsPoints = require('../../../test/helpers/comparePolygonsAsPoints')

test('extrudeFromSlices (defaults)', t => {
  let geometry2 = geom2.fromPoints([[10, 10], [-10, 10], [-10, -10], [10, -10]])

  let geometry3 = extrudeFromSlices({ }, geometry2)
  let pts = geom3.toPoints(geometry3)
  let exp = [
    [[10.0, -10.0, 0.0], [10.0, 10.0, 0.0], [10.0, 10.0, 1.0]],
    [[10.0, -10.0, 0.0], [10.0, 10.0, 1.0], [10.0, -10.0, 1.0]],
    [[10.0, 10.0, 0.0], [-10.0, 10.0, 0.0], [-10.0, 10.0, 1.0]],
    [[10.0, 10.0, 0.0], [-10.0, 10.0, 1.0], [10.0, 10.0, 1.0]],
    [[-10.0, 10.0, 0.0], [-10.0, -10.0, 0.0], [-10.0, -10.0, 1.0]],
    [[-10.0, 10.0, 0.0], [-10.0, -10.0, 1.0], [-10.0, 10.0, 1.0]],
    [[-10.0, -10.0, 0.0], [10.0, -10.0, 0.0], [10.0, -10.0, 1.0]],
    [[-10.0, -10.0, 0.0], [10.0, -10.0, 1.0], [-10.0, -10.0, 1.0]],
    [[10, 10, 1], [-10, 10, 1], [-10, -10, 1], [10, -10, 1]],
    [[10, -10, 0], [-10, -10, 0], [-10, 10, 0], [10, 10, 0]]
  ]
  t.is(pts.length, 10)
  t.true(comparePolygonsAsPoints(pts, exp))

  let poly2 = poly3.fromPoints([[10, 10, 0], [-10, 10, 0], [-10, -10, 0], [10, -10, 0]])
  geometry3 = extrudeFromSlices({ }, poly2)
  pts = geom3.toPoints(geometry3)

  t.is(pts.length, 10)
  t.true(comparePolygonsAsPoints(pts, exp))
})

test('extrudeFromSlices (torus)', t => {
  var sqrt3 = Math.sqrt(3) / 2
  var radius = 10

  var hex = poly3.fromPoints([
    [radius, 0, 0],
    [radius / 2, radius * sqrt3, 0],
    [-radius / 2, radius * sqrt3, 0],
    [-radius, 0, 0],
    [-radius / 2, -radius * sqrt3, 0],
    [radius / 2, -radius * sqrt3, 0]
  ])
  hex = poly3.transform(mat4.fromTranslation([0, 20, 0]), hex)
  hex = slice.fromPoints(poly3.toPoints(hex))

  var angle = 45
  let geometry3 = extrudeFromSlices(
    {
      numberOfSlices: 360 / angle,
      isCapped: false,
      callback: function (t, index) {
        return slice.transform(mat4.fromXRotation(degToRad(angle * index)), this)
      }
    }, hex
  )
  let pts = geom3.toPoints(geometry3)
  t.is(pts.length, 96)
})

test('extrudeFromSlices (same shape, changing dimensions)', t => {
  const base = slice.fromPoints([ [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0] ])
  let geometry3 = extrudeFromSlices(
    {
      numberOfSlices: 4,
      callback: function (t, count) {
        let newslice = slice.transform(mat4.fromTranslation([0, 0, count * 2]), this)
        newslice = slice.transform(mat4.fromScaling([1 + count, 1 + (count / 2), 1]), newslice)
        return newslice
      }
    }, base
  )
  let pts = geom3.toPoints(geometry3)
  t.is(pts.length, 26)
})

test('extrudeFromSlices (changing shape, changing dimensions)', t => {
  const base = circle({ radius: 4, segments: 4 })
  let geometry3 = extrudeFromSlices(
    {
      numberOfSlices: 5,
      callback: (t, count) => {
        let newshape = circle({ radius: 5 + count, segments: 4 + count })
        let newslice = slice.fromSides(geom2.toSides(newshape))
        newslice = slice.transform(mat4.fromTranslation([0, 0, count * 10]), newslice)
        return newslice
      }
    }, base
  )
  let pts = geom3.toPoints(geometry3)
  t.is(pts.length, 298)
})

test('extrudeFromSlices (holes)', t => {
  let geometry2 = geom2.create(
    [
      [[-10.0, 10.0], [-10.0, -10.0]],
      [[-10.0, -10.0], [10.0, -10.0]],
      [[10.0, -10.0], [10.0, 10.0]],
      [[10.0, 10.0], [-10.0, 10.0]],
      [[-5.0, -5.0], [-5.0, 5.0]],
      [[5.0, -5.0], [-5.0, -5.0]],
      [[5.0, 5.0], [5.0, -5.0]],
      [[-5.0, 5.0], [5.0, 5.0]]
    ]
  )
  let geometry3 = extrudeFromSlices({ }, geometry2)
  let pts = geom3.toPoints(geometry3)
  let exp = [
    [ [ -10, 10, 0 ], [ -10, -10, 0 ], [ -10, -10, 1 ] ],
    [ [ -10, 10, 0 ], [ -10, -10, 1 ], [ -10, 10, 1 ] ],
    [ [ -10, -10, 0 ], [ 10, -10, 0 ], [ 10, -10, 1 ] ],
    [ [ -10, -10, 0 ], [ 10, -10, 1 ], [ -10, -10, 1 ] ],
    [ [ 10, -10, 0 ], [ 10, 10, 0 ], [ 10, 10, 1 ] ],
    [ [ 10, -10, 0 ], [ 10, 10, 1 ], [ 10, -10, 1 ] ],
    [ [ 10, 10, 0 ], [ -10, 10, 0 ], [ -10, 10, 1 ] ],
    [ [ 10, 10, 0 ], [ -10, 10, 1 ], [ 10, 10, 1 ] ],
    [ [ -5, -5, 0 ], [ -5, 5, 0 ], [ -5, 5, 1 ] ],
    [ [ -5, -5, 0 ], [ -5, 5, 1 ], [ -5, -5, 1 ] ],
    [ [ 5, -5, 0 ], [ -5, -5, 0 ], [ -5, -5, 1 ] ],
    [ [ 5, -5, 0 ], [ -5, -5, 1 ], [ 5, -5, 1 ] ],
    [ [ 5, 5, 0 ], [ 5, -5, 0 ], [ 5, -5, 1 ] ],
    [ [ 5, 5, 0 ], [ 5, -5, 1 ], [ 5, 5, 1 ] ],
    [ [ -5, 5, 0 ], [ 5, 5, 0 ], [ 5, 5, 1 ] ],
    [ [ -5, 5, 0 ], [ 5, 5, 1 ], [ -5, 5, 1 ] ],
    [ [ -10, -10, 1 ], [ -5, -10, 1 ], [ -5, 10, 1 ], [ -10, 10, 1 ] ],
    [ [ 10, -10, 1 ], [ 10, -5, 1 ], [ -5, -5, 1 ], [ -5, -10, 1 ] ],
    [ [ 10, 10, 1 ], [ 5, 10, 1 ], [ 5, -5, 1 ], [ 10, -5, 1 ] ],
    [ [ 5, 5, 1 ], [ 5, 10, 1 ], [ -5, 10, 1 ], [ -5, 5, 1 ] ],
    [ [ -10, 10, 0 ], [ -5, 10, 0 ], [ -5, -10, 0 ], [ -10, -10, 0 ] ],
    [ [ 10, -10, 0 ], [ -5, -10, 0 ], [ -5, -5, 0 ], [ 10, -5, 0 ] ],
    [ [ 10, -5, 0 ], [ 5, -5, 0 ], [ 5, 10, 0 ], [ 10, 10, 0 ] ],
    [ [ 5, 10, 0 ], [ 5, 5, 0 ], [ -5, 5, 0 ], [ -5, 10, 0 ] ]
  ]
  t.is(pts.length, 24)
  t.true(comparePolygonsAsPoints(pts, exp))
})
