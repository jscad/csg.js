const test = require('ava')

const fromPoints = require('./fromPoints')

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
  t.deepEqual(fromPoints(points), expected)
})
