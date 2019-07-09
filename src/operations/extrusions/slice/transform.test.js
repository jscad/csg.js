const test = require('ava')

const { transform, fromPoints, toPoints } = require('./index')

test('slice: transform() should return a new slice with correct values', (t) => {
  const identityMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]

  const org1 = fromPoints([[0, 0], [1, 0], [1, 1]])
  const ret1 = transform(identityMatrix, org1)
  t.not(org1, ret1)

  const pts1 = toPoints(ret1)
  const exp1 = [
    new Float32Array([1, 1, 0]),
    new Float32Array([0, 0, 0]),
    new Float32Array([1, 0, 0])
  ]
  t.deepEqual(pts1, exp1)

  const x = 1
  const y = 5
  const z = 7
  const translationMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ]

  const org2 = fromPoints([[0, 0], [1, 0], [1, 1]])
  const ret2 = transform(translationMatrix, org2)
  t.not(org2, ret2)

  const pts2 = toPoints(ret2)
  const exp2 = [
    new Float32Array([2, 6, 7]),
    new Float32Array([1, 5, 7]),
    new Float32Array([2, 5, 7])
  ]
  t.deepEqual(pts2, exp2)

  const r = (90 * 0.017453292519943295)
  const rotateZMatrix = [
    Math.cos(r), -Math.sin(r), 0, 0,
    Math.sin(r), Math.cos(r), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]

  const org3 = fromPoints([[0, 0], [1, 0], [1, 1]])
  const ret3 = transform(rotateZMatrix, org3)
  t.not(org3, ret3)

  const pts3 = toPoints(ret3)
  const exp3 = [
    new Float32Array([1, -1, 0]),
    new Float32Array([0, 0, 0]),
    new Float32Array([6.123234262925839e-17, -1, 0])
  ]
  t.deepEqual(pts3, exp3)
})
