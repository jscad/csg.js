const test = require('ava')

const {star} = require('./index')

const geom2 = require('../geometry/geom2')

const comparePoints = require('../../test/helpers/comparePoints')

test('star (defaults)', t => {
  const exp = [
    [ 1, 0 ],
    [ 0.30901700258255005, 0.224513977766037 ],
    [ 0.30901700258255005, 0.9510565400123596 ],
    [ -0.1180339902639389, 0.3632712662220001 ],
    [ -0.80901700258255, 0.5877852439880371 ],
    [ -0.3819660246372223, 4.6777348190004433e-17 ],
    [ -0.80901700258255, -0.5877852439880371 ],
    [ -0.1180339902639389, -0.3632712662220001 ],
    [ 0.30901700258255005, -0.9510565400123596 ],
    [ 0.30901700258255005, -0.224513977766037 ]
  ]
  const geometry = star()
  const obs = geom2.toPoints(geometry)

  t.deepEqual(obs.length, 10)
  t.true(comparePoints(obs, exp))
})
