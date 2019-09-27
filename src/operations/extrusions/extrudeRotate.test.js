const test = require('ava')

const { degToRad } = require('../../math/utils')

const { geom2, geom3 } = require('../../geometry')

const extrudeRotate = require('./extrudeRotate')

const comparePolygonsAsPoints = require('../../../test/helpers/comparePolygonsAsPoints')

test('extrudeRotate: (defaults) extruding of a geom2 produces an expected geom3', t => {
  let geometry2 = geom2.fromPoints([[10, 8], [10, -8], [26, -8], [26, 8]])

  let geometry3 = extrudeRotate({ }, geometry2)
  let pts = geom3.toPoints(geometry3)
  t.is(pts.length, 96)
})

test('extrudeRotate: (angle) extruding of a geom2 produces an expected geom3', t => {
  let geometry2 = geom2.fromPoints([[10, 8], [10, -8], [26, -8], [26, 8]])

  // test angle
  let geometry3 = extrudeRotate({ segments: 4, angle: degToRad(45) }, geometry2)
  let pts = geom3.toPoints(geometry3)
  let exp = [
    [ [ 10, 4.898587410340671e-16, 8 ], [ 26, 4.898587410340671e-16, 8 ], [ 18.384775161743164, 18.384775161743164, 8 ] ],
    [ [ 10, 4.898587410340671e-16, 8 ], [ 18.384775161743164, 18.384775161743164, 8 ], [ 7.071067810058594, 7.071067810058594, 8 ] ],
    [ [ 10, -4.898587410340671e-16, -8 ], [ 10, 4.898587410340671e-16, 8 ], [ 7.071067810058594, 7.071067810058594, 8 ] ],
    [ [ 10, -4.898587410340671e-16, -8 ], [ 7.071067810058594, 7.071067810058594, 8 ], [ 7.071067810058594, 7.071067810058594, -8 ] ],
    [ [ 26, -4.898587410340671e-16, -8 ], [ 10, -4.898587410340671e-16, -8 ], [ 7.071067810058594, 7.071067810058594, -8 ] ],
    [ [ 26, -4.898587410340671e-16, -8 ], [ 7.071067810058594, 7.071067810058594, -8 ], [ 18.384775161743164, 18.384775161743164, -8 ] ],
    [ [ 26, 4.898587410340671e-16, 8 ], [ 26, -4.898587410340671e-16, -8 ], [ 18.384775161743164, 18.384775161743164, -8 ] ],
    [ [ 26, 4.898587410340671e-16, 8 ], [ 18.384775161743164, 18.384775161743164, -8 ], [ 18.384775161743164, 18.384775161743164, 8 ] ],
    [ [ 18.384775161743164, 18.384775161743164, 8 ], [ 18.384775161743164, 18.384775161743164, -8 ],
      [ 7.071067810058594, 7.071067810058594, -8 ], [ 7.071067810058594, 7.071067810058594, 8 ] ],
    [ [ 10, 4.898587410340671e-16, 8 ], [ 10, -4.898587410340671e-16, -8 ],
      [ 26, -4.898587410340671e-16, -8 ], [ 26, 4.898587410340671e-16, 8 ] ]
  ]
  t.is(pts.length, 10)
  t.true(comparePolygonsAsPoints(pts, exp))

  geometry3 = extrudeRotate({ segments: 4, angle: degToRad(-250) }, geometry2)
  pts = geom3.toPoints(geometry3)
  t.is(pts.length, 26)

  geometry3 = extrudeRotate({ segments: 4, angle: degToRad(250) }, geometry2)
  pts = geom3.toPoints(geometry3)
  t.is(pts.length, 26)
})

test('extrudeRotate: (startAngle) extruding of a geom2 produces an expected geom3', t => {
  let geometry2 = geom2.fromPoints([[10, 8], [10, -8], [26, -8], [26, 8]])

  // test startAngle
  let geometry3 = extrudeRotate({ segments: 5, startAngle: degToRad(45) }, geometry2)
  let pts = geom3.toPoints(geometry3)
  let exp = [
    new Float32Array([ 7.071067810058594, 7.071067810058594, 8 ]),
    new Float32Array([ 18.384775161743164, 18.384775161743164, 8 ]),
    new Float32Array([ -11.803752899169922, 23.166170120239258, 8 ])
  ]
  t.is(pts.length, 40)
  t.deepEqual(pts[0], exp)

  geometry3 = extrudeRotate({ segments: 5, startAngle: degToRad(-45) }, geometry2)
  pts = geom3.toPoints(geometry3)
  exp = [
    new Float32Array([ 7.071067810058594, -7.071067810058594, 8 ]),
    new Float32Array([ 18.384775161743164, -18.384775161743164, 8 ]),
    new Float32Array([ 23.166170120239258, 11.803752899169922, 8 ])
  ]
  t.is(pts.length, 40)
  t.deepEqual(pts[0], exp)
})

test('extrudeRotate: (segments) extruding of a geom2 produces an expected geom3', t => {
  let geometry2 = geom2.fromPoints([[10, 8], [10, -8], [26, -8], [26, 8]])

  // test segments
  let geometry3 = extrudeRotate({ segments: 4 }, geometry2)
  let pts = geom3.toPoints(geometry3)
  t.is(pts.length, 32)

  geometry3 = extrudeRotate({ segments: 64 }, geometry2)
  pts = geom3.toPoints(geometry3)
  t.is(pts.length, 512)

  // test overlapping edges
  geometry2 = geom2.fromPoints([[0, 0], [2, 1], [1, 2], [1, 3], [3, 4], [0, 5]])
  geometry3 = extrudeRotate({ segments: 8 }, geometry2)
  pts = geom3.toPoints(geometry3)
  t.is(pts.length, 96)
})

// TEST HOLES
