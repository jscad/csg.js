const test = require('ava')

const { degToRad } = require('../../math/utils')

const { geom2, geom3 } = require('../../geometry')

const { arc, rectangle } = require('../../primitives')

const extrudeRectangular = require('./extrudeRectangular')

test('extrudeRectangular (defaults)', t => {
  let geometry1 = arc({ radius: 5, endAngle: degToRad(90) })
  let geometry2 = rectangle({ size: [5, 5] })

  let obs = extrudeRectangular({ }, geometry1)
  let pts = geom3.toPoints(obs)
  t.is(pts.length, 42)

  obs = extrudeRectangular({ }, geometry2)
  pts = geom3.toPoints(obs)
  t.is(pts.length, 32)
})

test('extrudeRectangular (segments = 1)', t => {
  let geometry1 = arc({ radius: 5, endAngle: degToRad(90) })
  let geometry2 = rectangle({ size: [5, 5] })

  let obs = extrudeRectangular({ segments: 1 }, geometry1)
  let pts = geom3.toPoints(obs)
  t.is(pts.length, 50)

  obs = extrudeRectangular({ segments: 1 }, geometry2)
  pts = geom3.toPoints(obs)
  t.is(pts.length, 40)
})

test('extrudeRectangular (segments = 8)', t => {
  let geometry1 = arc({ radius: 5, endAngle: degToRad(90) })
  let geometry2 = rectangle({ size: [5, 5] })

  let obs = extrudeRectangular({ segments: 8 }, geometry1)
  let pts = geom3.toPoints(obs)
  t.is(pts.length, 56)

  obs = extrudeRectangular({ segments: 8 }, geometry2)
  pts = geom3.toPoints(obs)
  t.is(pts.length, 40)
})

test('extrudeRectangular (holes)', t => {
  let geometry2 = geom2.create([
    [[15.00000, 15.00000], [-15.00000, 15.00000]],
    [[-15.00000, 15.00000], [-15.00000, -15.00000]],
    [[-15.00000, -15.00000], [15.00000, -15.00000]],
    [[15.00000, -15.00000], [15.00000, 15.00000]],
    [[-5.00000, 5.00000], [5.00000, 5.00000]],
    [[5.00000, 5.00000], [5.00000, -5.00000]],
    [[5.00000, -5.00000], [-5.00000, -5.00000]],
    [[-5.00000, -5.00000], [-5.00000, 5.00000]]
  ])

  let obs = extrudeRectangular({ radius: 2, offset: [0, 0, 15], segments: 16 }, geometry2)
  let pts = geom3.toPoints(obs)
  t.is(pts.length, 112)
})
