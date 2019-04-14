const test = require('ava')

const {canonicalize, fromPoints, toString} = require('./index')

test('canonicalize: Updates a geom3 with canonalized polygons', (t) => {
  const points = [[[0, 0, 0], [1, 0, 0], [1, 0, 1]]]
  const expected = {
    basePolygons: [
      {
        plane: new Float32Array([0, -1, 0, 0]),
        vertices: [
          new Float32Array([0, 0, 0]),
          new Float32Array([1, 0, 0]),
          new Float32Array([1, 0, 1]),
         ]
      }
    ],
    polygons: [
      {
        plane: new Float32Array([0, -1, 0, 0]),
        vertices: [
          new Float32Array([0, 0, 0]),
          new Float32Array([1, 0, 0]),
          new Float32Array([1, 0, 1]),
         ]
      }
    ],
    isCanonicalized: true, isRetesselated: false,
    transforms: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])
  }
  const geometry = fromPoints(points)
  const updated = canonicalize(geometry)
  t.is(geometry, updated)
  t.deepEqual(updated, expected)

  const updated2 = canonicalize(updated)
  t.is(updated, updated2)
  t.deepEqual(updated2, expected)
})
