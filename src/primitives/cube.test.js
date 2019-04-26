const test = require('ava')

const geom3 = require('../geometry/geom3')

const {cube} = require('./index')

test('cube (alias defaults)', t => {
  const obs = cube()
  const pts = geom3.toPoints(obs)
  t.is(pts.length, 6)
})
