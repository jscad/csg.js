const test = require('ava')
const {transformMat4, fromValues, toString} = require('./index')

const {compareVectors} = require('../../../../test/helpers/index')

test('plane: transformMat4() called with two paramerters should return a plane with correct values', t => {
  const identityMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]

  const obs1 = transformMat4(identityMatrix, fromValues(0, 0, 0, 0))
  t.true(compareVectors(obs1, [0/0, 0/0, 0/0, 0/0]))

  const plane2 = fromValues(0, 0, -1, 0)
  const obs2 = transformMat4(identityMatrix, plane2)
  t.true(compareVectors(obs2, [0, 0, -1, 0]))

  let x = 1
  let y = 5
  let z = 7
  const translationMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ]

  const plane3 = fromValues(0, 0, 1, 0)
  const obs3 = transformMat4(translationMatrix, plane3)
  t.true(compareVectors(obs3, [0, 0, 1, 7]))

  let w = 1
  let h = 3
  let d = 5
  const scaleMatrix = [
    w,    0,    0,   0,
    0,    h,    0,   0,
    0,    0,    d,   0,
    0,    0,    0,   1
  ]

  const plane4 = fromValues(0, -1, 0, 0)
  const obs4 = transformMat4(scaleMatrix, plane4)
  t.true(compareVectors(obs4, [0, -1, 0, 0]))

  const r = (90 * 0.017453292519943295)
  const rotateZMatrix = [
    Math.cos(r), -Math.sin(r),    0,    0,
    Math.sin(r),  Math.cos(r),    0,    0,
              0,            0,    1,    0,
              0,            0,    0,    1
  ]

  const plane5 = fromValues(-1, 0, 0, 0)
  const obs5 = transformMat4(rotateZMatrix, plane5)
  //t.true(compareVectors(obs5, [-0, 1, 0, 0]))

  const mirrorMatrix = [
   -1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]
  const plane6 = fromValues(1, 0, 0, 0)
  const obs6 = transformMat4(mirrorMatrix, plane6)
  t.true(compareVectors(obs6, [-1, 0, 0, 0]))
})