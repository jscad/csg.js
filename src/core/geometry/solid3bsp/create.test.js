const mat4 = require('../../math/mat4')
const test = require('ava')
const { create } = require('./index')

test('geom3: create() should return an empty geometry', (t) => {
  const obs = create()
  const exp = {
    basePolygons: [],
    isCanonicalized: true,
    isNegative: false,
    isRetesselated: true,
    polygons: [],
    transforms: mat4.identity(),
  }
  t.deepEqual(obs, exp)
})
