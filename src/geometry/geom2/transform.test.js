const test = require('ava')

const mat4 = require('../../math/mat4')

const {transform, fromPoints} = require('./index')

test('transform: adjusts the transforms of geom2', (t) => {
  const points = [[0, 0], [1, 0], [0, 1]]
  const rotation = 90 * 0.017453292519943295
  const rotate90 = mat4.fromZRotation(rotation)

  const expected = {baseSides: [
                      [new Float32Array([0, 1]), new Float32Array([0, 0])],
                      [new Float32Array([0, 0]), new Float32Array([1, 0])],
                      [new Float32Array([1, 0]), new Float32Array([0, 1])]
                    ],
                    sides: [], isCanonicalized: false,
                    transforms: new Float32Array([6.123233995736766e-17, 1, 0, 0, -1, 6.123233995736766e-17, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) }
  const geometry = fromPoints(points)
  const another = transform(rotate90, geometry)
  t.not(geometry, another)
  t.deepEqual(another, expected)
})
