const test = require('ava')

const {degToRad} = require('../../math/utils')

const {geom2, geom3} = require('../../geometry')

const extrudeRotate = require('./extrudeRotate')

const comparePolygonsAsPoints = require('../../../test/helpers/comparePolygonsAsPoints')

test('extrudeRotate: extruding of a geom2 produces an expected geom3', t => {
  let geometry2 = geom2.fromPoints([[10, 8], [10, -8], [26, -8], [26, 8]])

  let geometry3 = extrudeRotate({}, geometry2)
  let pts = geom3.toPoints(geometry3)
  t.is(pts.length, 96)

  // test angle
  geometry3 = extrudeRotate({segments: 4, angle: degToRad(45)}, geometry2)
  pts = geom3.toPoints(geometry3)
  let exp = [
    [ [ 10, 0, 8 ], [ 7.071067810058594, 7.071067810058594, 8 ], [ 7.071067810058594, 7.071067810058594, -8 ] ],
    [ [ 7.071067810058594, 7.071067810058594, -8 ], [ 10, 0, -8 ], [ 10, 0, 8 ] ],
    [ [ 10, 0, -8 ], [ 7.071067810058594, 7.071067810058594, -8 ], [ 18.384775161743164, 18.384775161743164, -8 ] ],
    [ [ 18.384775161743164, 18.384775161743164, -8 ], [ 26, 0, -8 ], [ 10, 0, -8 ] ],
    [ [ 26, 0, -8 ], [ 18.384775161743164, 18.384775161743164, -8 ], [ 18.384775161743164, 18.384775161743164, 8 ] ],
    [ [ 18.384775161743164, 18.384775161743164, 8 ], [ 26, 0, 8 ], [ 26, 0, -8 ] ],
    [ [ 26, 0, 8 ], [ 18.384775161743164, 18.384775161743164, 8 ], [ 7.071067810058594, 7.071067810058594, 8 ] ],
    [ [ 7.071067810058594, 7.071067810058594, 8 ], [ 10, 0, 8 ], [ 26, 0, 8 ] ],
    [ [ 7.071067810058594, 7.071067810058594, 8 ], [ 18.384775161743164, 18.384775161743164, 8 ],
      [ 18.384775161743164, 18.384775161743164, -8 ], [ 7.071067810058594, 7.071067810058594, -8 ] ],
    [ [ 10, -4.898587410340671e-16, -8 ], [ 26, -4.898587410340671e-16, -8 ],
      [ 26, 4.898587410340671e-16, 8 ], [ 10, 4.898587410340671e-16, 8 ] ]
  ]
  t.is(pts.length, 10)
  t.true(comparePolygonsAsPoints(pts, exp))

  geometry3 = extrudeRotate({segments: 4, angle: degToRad(-250)}, geometry2)
  pts = geom3.toPoints(geometry3)
  t.is(pts.length, 26)

  geometry3 = extrudeRotate({segments: 4, angle: degToRad(250)}, geometry2)
  pts = geom3.toPoints(geometry3)
  t.is(pts.length, 26)

  // test startAngle
  geometry3 = extrudeRotate({segments: 5, startAngle: degToRad(45)}, geometry2)
  pts = geom3.toPoints(geometry3)
  exp = [
    new Float32Array([ 7.071067810058594, 7.071067810058594, 8 ]),
    new Float32Array([ -4.539905071258545, 8.910065650939941, 8 ]),
    new Float32Array([ -4.539905071258545, 8.910065650939941, -8 ])
  ]
  t.is(pts.length, 40)
  t.deepEqual(pts[0], exp)

  geometry3 = extrudeRotate({segments: 5, startAngle: degToRad(-45)}, geometry2)
  pts = geom3.toPoints(geometry3)
  exp = [
    new Float32Array([ 7.071067810058594, -7.071067810058594, 8 ]),
    new Float32Array([ 8.910065650939941, 4.539905071258545, 8 ]),
    new Float32Array([ 8.910065650939941, 4.539905071258545, -8 ])
  ]
  t.is(pts.length, 40)
  t.deepEqual(pts[0], exp)

  // test segments
  geometry3 = extrudeRotate({segments: 4}, geometry2)
  pts = geom3.toPoints(geometry3)
  t.is(pts.length, 32)

  geometry3 = extrudeRotate({segments: 64}, geometry2)
  pts = geom3.toPoints(geometry3)
  t.is(pts.length, 512)

  // test overlapping edges
  geometry2 = geom2.fromPoints([[0, 0], [2, 1], [1, 2], [1, 3], [3, 4], [0, 5]])
  geometry3 = extrudeRotate({segments: 8}, geometry2)
  pts = geom3.toPoints(geometry3)
  t.is(pts.length, 88)
})
