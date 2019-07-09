const test = require('ava')

const { geom2 } = require('../../geometry')

const hullChain = require('./hullChain')

test('hullChain (two)', t => {
  let geometry1 = geom2.fromPoints([[6, 6], [3, 6], [3, 3], [6, 3]])
  let geometry2 = geom2.fromPoints([[-6, -6], [-9, -6], [-9, -9], [-6, -9]])

  // same
  let obs = hullChain({}, geometry1, geometry1)
  let pts = geom2.toPoints(obs)

  t.is(pts.length, 4)

  // different
  obs = hullChain({}, geometry1, geometry2)
  pts = geom2.toPoints(obs)

  t.is(pts.length, 6)
})

test('hullChain (three)', t => {
  let geometry1 = geom2.fromPoints([[6, 6], [3, 6], [3, 3], [6, 3]])
  let geometry2 = geom2.fromPoints([[-6, -6], [-9, -6], [-9, -9], [-6, -9]])
  let geometry3 = geom2.fromPoints([[-6, 6], [-3, 6], [-3, 9], [-6, 9]])

  // closed = false
  let obs = hullChain({ closed: false }, geometry1, geometry2, geometry3)
  let pts = geom2.toPoints(obs)

  t.is(pts.length, 10)

  // closed = true
  obs = hullChain({ closed: true }, geometry1, geometry2, geometry3)
  pts = geom2.toPoints(obs)

  t.is(pts.length, 10)
})
