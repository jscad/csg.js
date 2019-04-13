const test = require('ava')

const poly3 = require('../poly3')

const create = require('./create')

test('create: Creates an empty, uncanonicalized geom3', t => {
  const expected = {basePolygons: [], polygons: [], isCanonicalized: false, isRetesselated: false,
                    transforms: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]) }
  return t.deepEqual(create(), expected)
})

test('create: Creates a populated, uncanonicalized geom3', t => {
  const points = [[0,  0, 0], [0, 10, 0], [0, 10, 10]]
  const polygon = poly3.fromPoints(points)

  const polygons = [polygon]
  const expected = {basePolygons: polygons, polygons: [], isCanonicalized : false, isRetesselated: false,
                    transforms: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]) }
  return t.deepEqual(create(polygons), expected)
})
