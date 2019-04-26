const test = require('ava')

const {square} = require('./index')

const geom2 = require('../geometry/geom2')

test('square (alias defaults)', t => {
  const geometry = square()
  const obs = geom2.toPoints(geometry)
  t.deepEqual(obs.length, 4)
})
