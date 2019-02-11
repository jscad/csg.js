const test = require('ava')

const { transform, fromPoints } = require('./index')

const equals = require('./equals')

test('poly3: transform() should return a new poly3 with correct values', (t) => {
  const identityMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]

  const exp1 = [[0, 0, 0], [1, 0, 0], [1, 1, 0]]; exp1.plane = [0, 0, 1, 0]
  const org1 = fromPoints([[0, 0, 0], [1, 0, 0], [1, 1, 0]])
  const ret1 = transform(identityMatrix, org1)
  t.true(equals(ret1, exp1))
  t.not(org1, ret1)

  const x = 1
  const y = 5
  const z = 7
  const translationMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ]

  const exp2 = [[1, 5, 7], [2, 5, 7], [2, 6, 7]]; exp2.plane = [0, 0, 1, 7]
  const org2 = fromPoints([[0, 0, 0], [1, 0, 0], [1, 1, 0]])
  const ret2 = transform(translationMatrix, org2)
  t.true(equals(ret2, exp2))
  // ⠧ [2K[1A[2K[GQQ/equals/plane: {"0":0,"1":0,"2":1,"3":0} vs [0,0,1,7]
  t.not(org2, ret2)

  const r = (90 * 0.017453292519943295)
  const rotateZMatrix = [
    Math.cos(r), -Math.sin(r), 0, 0,
    Math.sin(r),  Math.cos(r), 0, 0,
              0,            0, 1, 0,
              0,            0, 0, 1
  ]

  const exp3 = [[0, 0, 0], [0, -1, 0], [1, -1, 0]]; exp3.plane = [0, 0, 1, 0]
  const org3 = fromPoints([[0, 0, 0], [1, 0, 0], [1, 1, 0]])
  const ret3 = transform(rotateZMatrix, org3)
  t.true(equals(ret3, exp3))
  t.not(org3, ret3)

  const mirrorMatrix = [
    -1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]
  const exp4 = [[-1, 1, 0], [-1, 0, 0], [0, 0, 0]]; exp4.plane = [0, 0, 1, 0]
  const org4 = fromPoints([[0, 0, 0], [1, 0, 0], [1, 1, 0]])
  const ret4 = transform(mirrorMatrix, org4)
  t.true(equals(ret4, exp4))
  t.not(org4, ret4)
})
