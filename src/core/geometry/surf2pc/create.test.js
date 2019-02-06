const test = require('ava')
const create = require('./create')

test('create: create() should return a new empty geometry', t => {
  const surface = create()
  t.deepEqual(surface.basePolygons, [])
  t.is(surface.isCanonicalized, true)
})
