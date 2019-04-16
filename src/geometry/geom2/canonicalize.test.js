const test = require('ava')

const {canonicalize, fromPoints, toString} = require('./index')

test('canonicalize: Updates a populated geom2 with canonalized sides', (t) => {
  const points = [[0, 0], [1, 0], [0, 1]]
  const expected = {
    sides: [
      [new Float32Array([0, 1]), new Float32Array([0, 0])],
      [new Float32Array([0, 0]), new Float32Array([1, 0])],
      [new Float32Array([1, 0]), new Float32Array([0, 1])]
    ],
    isCanonicalized: true,
    transforms: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])
  }
  const geometry = fromPoints(points)
  const updated = canonicalize(geometry)
  t.is(geometry, updated)
  t.deepEqual(updated, expected)

  const updated2 = canonicalize(updated)
  t.is(updated, updated2)
  t.deepEqual(updated, expected)

// TODO : test with mirrored geometry, see transform.js
})
