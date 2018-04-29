const test = require('ava')
const create = require('./create')

test('shape3: create() should return an empty shape3', t => {
  const obs = create()
  const exp = { type: 'shape3',
    polygons: [],
    properties: {},
    isCanonicalized: true,
    isRetesselated: true }
  t.deepEqual(obs, exp)
})
