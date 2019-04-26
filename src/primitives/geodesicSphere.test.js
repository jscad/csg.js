const test = require('ava')

const geom3 = require('../geometry/geom3')

const {geodesicSphere} = require('./index')

test('geodesicSphere (defaults)', t => {
  const obs = geodesicSphere()
  const pts = geom3.toPoints(obs)
  const exp = [
  ]
  t.is(pts.length, 20)
})
