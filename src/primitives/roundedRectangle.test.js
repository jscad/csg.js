const test = require('ava')

const {roundedRectangle} = require('./index')

const geom2 = require('../geometry/geom2')

const comparePoints = require('../../test/helpers/comparePoints')

test('roundedRectangle (defaults)', t => {
  const exp = [
    new Float32Array([ 1, 0.800000011920929 ]),
    new Float32Array([ 0.9847759008407593, 0.8765367269515991 ]),
    new Float32Array([ 0.941421389579773, 0.941421389579773 ]),
    new Float32Array([ 0.8765367269515991, 0.9847759008407593 ]),
    new Float32Array([ 0.800000011920929, 1 ]),
    new Float32Array([ -0.800000011920929, 1 ]),
    new Float32Array([ -0.8765367269515991, 0.9847759008407593 ]),
    new Float32Array([ -0.941421389579773, 0.941421389579773 ]),
    new Float32Array([ -0.9847759008407593, 0.8765367269515991 ]),
    new Float32Array([ -1, 0.800000011920929 ]),
    new Float32Array([ -1, -0.800000011920929 ]),
    new Float32Array([ -0.9847759008407593, -0.8765367269515991 ]),
    new Float32Array([ -0.941421389579773, -0.941421389579773 ]),
    new Float32Array([ -0.8765367269515991, -0.9847759008407593 ]),
    new Float32Array([ -0.800000011920929, -1 ]),
    new Float32Array([ 0.800000011920929, -1 ]),
    new Float32Array([ 0.8765367269515991, -0.9847759008407593 ]),
    new Float32Array([ 0.941421389579773, -0.941421389579773 ]),
    new Float32Array([ 0.9847759008407593, -0.8765367269515991 ]),
    new Float32Array([ 1, -0.800000011920929 ])
  ]
  const geometry = roundedRectangle()
  const obs = geom2.toPoints(geometry)

  t.deepEqual(obs.length, 20)
  t.true(comparePoints(obs, exp))
})
