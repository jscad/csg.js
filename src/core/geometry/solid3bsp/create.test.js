const equals = require('./equals')
const mat4 = require('../../math/mat4')
const test = require('ava')
const { create } = require('./index')

test('create() should return an empty geometry', (t) => {
  const obs = create()
  const exp = {
    basePolygons: [],
    isCanonicalized: true,
    isRetessellated: true,
    polygons: [],
    transforms: mat4.identity(),
  }
  t.true(equals(obs, exp))
})
