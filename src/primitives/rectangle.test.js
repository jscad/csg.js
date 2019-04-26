const test = require('ava')

const {rectangle} = require('./index')

const geom2 = require('../geometry/geom2')

const comparePoints = require('../../test/helpers/comparePoints')

test('rectangle (defaults)', t => {
  const exp = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1]
  ]
  const geometry = rectangle()
  const obs = geom2.toPoints(geometry)

  t.deepEqual(obs.length, 4)
  t.true(comparePoints(obs, exp))
})
