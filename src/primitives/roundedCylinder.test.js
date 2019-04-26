const test = require('ava')

const geom3 = require('../geometry/geom3')

const {roundedCylinder} = require('./index')

test('roundedCylinder (defaults)', t => {
  const obs = roundedCylinder()
  const pts = geom3.toPoints(obs)

  t.is(pts.length, 84)
})
