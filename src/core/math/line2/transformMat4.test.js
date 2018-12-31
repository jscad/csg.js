const test = require('ava')
const { transformMat4, create, fromPoints, toString } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('line2: transformMat4() called with two paramerters should return a line2 with correct values', (t) => {
  const line1 = create()
  const line2 = fromPoints([0, 0], [0, 1])
  const line3 = fromPoints([-3, -3], [3, 3])

  const identityMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]

  let obs1 = transformMat4(identityMatrix, line1)
  t.true(compareVectors(obs1, [0, 1, 0]))
  obs1 = transformMat4(identityMatrix, line2)
  t.true(compareVectors(obs1, [-1, 0, 0]))
  obs1 = transformMat4(identityMatrix, line3)
  t.true(compareVectors(obs1, [-0.7071067690849304, 0.7071067690849304, 0]))

  const x = 1
  const y = 5
  const z = 7
  const translationMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ]

  let obs2 = transformMat4(translationMatrix, line1)
  t.true(compareVectors(obs2, [0, 1, 5]))
  obs2 = transformMat4(translationMatrix, line2)
  t.true(compareVectors(obs2, [-1, 0, -1]))
  obs2 = transformMat4(translationMatrix, line3)
  t.true(compareVectors(obs2, [-0.7071066498756409, 0.70710688829422, 2.828427791595459]))

  const w = 1
  const h = 3
  const d = 5
  const scaleMatrix = [
    w, 0, 0, 0,
    0, h, 0, 0,
    0, 0, d, 0,
    0, 0, 0, 1
  ]

  let obs3 = transformMat4(scaleMatrix, line1)
  // rounding t.true(compareVectors(obs3, [0, 1, 0]))
  obs3 = transformMat4(scaleMatrix, line2)
  t.true(compareVectors(obs3, [-1, 0, 0]))
  obs3 = transformMat4(scaleMatrix, line3)
  t.true(compareVectors(obs3, [-0.9486833214759827, 0.3162277638912201, 0]))

  const r = (90 * 0.017453292519943295)
  const rotateZMatrix = [
    Math.cos(r), Math.sin(r), 0, 0,
   -Math.sin(r), Math.cos(r), 0, 0,
              0,            0, 1, 0,
              0,            0, 0, 1
  ]

  let obs4 = transformMat4(rotateZMatrix, line1)
  t.true(compareVectors(obs4, [-1, 0, 0]))
  obs4 = transformMat4(rotateZMatrix, line2)
  // rounding t.true(compareVectors(obs4, [0, -1, 0]))
  obs4 = transformMat4(rotateZMatrix, line3)
  t.true(compareVectors(obs4, [-0.7071067690849304, -0.7071067690849304, 0]))
})

test('line2: transformMat4() called with three paramerters should update a line2 with correct values', (t) => {
  const line1 = create()
  const line2 = fromPoints([0, 0], [0, 1])
  const line3 = fromPoints([-3, -3], [3, 3])

  const identityMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]

  let obs1 = create()
  let ret1 = transformMat4(obs1, identityMatrix, line1)
  t.true(compareVectors(ret1, [0, 1, 0]))
  t.true(compareVectors(obs1, [0, 1, 0]))
  ret1 = transformMat4(obs1, identityMatrix, line2)
  t.true(compareVectors(ret1, [-1, 0, 0]))
  t.true(compareVectors(obs1, [-1, 0, 0]))
  ret1 = transformMat4(obs1, identityMatrix, line3)
  t.true(compareVectors(ret1, [-0.7071067690849304, 0.7071067690849304, 0]))
  t.true(compareVectors(obs1, [-0.7071067690849304, 0.7071067690849304, 0]))

  const x = 1
  const y = 5
  const z = 7
  const translationMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ]

  let obs2 = create()
  let ret2 = transformMat4(obs2, translationMatrix, line1)
  t.true(compareVectors(ret2, [0, 1, 5]))
  t.true(compareVectors(obs2, [0, 1, 5]))
  ret2 = transformMat4(obs2, translationMatrix, line2)
  t.true(compareVectors(ret2, [-1, 0, -1]))
  t.true(compareVectors(obs2, [-1, 0, -1]))
  ret2 = transformMat4(obs2, translationMatrix, line3)
  t.true(compareVectors(ret2, [-0.7071066498756409, 0.70710688829422, 2.828427791595459]))
  t.true(compareVectors(obs2, [-0.7071066498756409, 0.70710688829422, 2.828427791595459]))

  const w = 1
  const h = 3
  const d = 5
  const scaleMatrix = [
    w, 0, 0, 0,
    0, h, 0, 0,
    0, 0, d, 0,
    0, 0, 0, 1
  ]

  let obs3 = create()
  let ret3 = transformMat4(obs3, scaleMatrix, line1)
  // rounding t.true(compareVectors(ret3, [0, 1, 0]))
  // rounding t.true(compareVectors(obs3, [0, 1, 0]))
  ret3 = transformMat4(obs3, scaleMatrix, line2)
  t.true(compareVectors(ret3, [-1, 0, 0]))
  t.true(compareVectors(obs3, [-1, 0, 0]))
  ret3 = transformMat4(obs3, scaleMatrix, line3)
  t.true(compareVectors(ret3, [-0.9486833214759827, 0.3162277638912201, 0]))
  t.true(compareVectors(obs3, [-0.9486833214759827, 0.3162277638912201, 0]))

  const r = (90 * 0.017453292519943295)
  const rotateZMatrix = [
    Math.cos(r), Math.sin(r), 0, 0,
   -Math.sin(r), Math.cos(r), 0, 0,
              0,            0, 1, 0,
              0,            0, 0, 1
  ]

  let obs4 = create()
  let ret4 = transformMat4(obs4, rotateZMatrix, line1)
  t.true(compareVectors(ret4, [-1, 0, 0]))
  t.true(compareVectors(obs4, [-1, 0, 0]))
  ret4 = transformMat4(obs4, rotateZMatrix, line2)
  // rounding t.true(compareVectors(ret4, [0, -1, 0]))
  // rounding t.true(compareVectors(obs4, [0, -1, 0]))
  ret4 = transformMat4(obs4, rotateZMatrix, line3)
  t.true(compareVectors(ret4, [-0.7071067690849304, -0.7071067690849304, 0]))
  t.true(compareVectors(obs4, [-0.7071067690849304, -0.7071067690849304, 0]))
})


