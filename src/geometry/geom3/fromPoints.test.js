const test = require('ava')

const {fromPoints} = require('./index')

test('fromPoints: Creates a populated geom3', (t) => {
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
    polygons: [], isCanonicalized: false, isRetesselated: false,
    transforms: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])
  }
  let obs = fromPoints(points)
  t.deepEqual(obs, expected)
})

test('fromPoints: throws for improper points', (t) => {
  t.throws(() => fromPoints(), Error)
  t.throws(() => fromPoints(0, 0, 0), Error)
  t.throws(() => fromPoints([[0, 0]]), Error)
  t.throws(() => fromPoints([[[0, 0, 0]]]), Error)
})
