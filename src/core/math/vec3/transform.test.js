const test = require('ava')
const { transform, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec3: transform() called with two paramerters should return a vec3 with correct values', (t) => {
  const identityMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]

  const obs1 = transform(identityMatrix, [0, 0, 0])
  t.true(compareVectors(obs1, [0, 0, 0]))

  const obs2 = transform(identityMatrix, [3, 2, 1])
  t.true(compareVectors(obs2, [3, 2, 1]))

  const x = 1
  const y = 5
  const z = 7
  const translationMatrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ]

  const obs3 = transform(translationMatrix, [-1, -2, -3])
  t.true(compareVectors(obs3, [0, 3, 4]))

  const w = 1
  const h = 3
  const d = 5
  const scaleMatrix = [
    w, 0, 0, 0,
    0, h, 0, 0,
    0, 0, d, 0,
    0, 0, 0, 1
  ]

  const obs4 = transform(scaleMatrix, [1, 2, 3])
  t.true(compareVectors(obs4, [1, 6, 15]))

  const r = (90 * 0.017453292519943295)
  const rotateZMatrix = [
    Math.cos(r), -Math.sin(r), 0, 0,
    Math.sin(r),  Math.cos(r), 0, 0,
              0,            0, 1, 0,
              0,            0, 0, 1
  ]

  const obs5 = transform(rotateZMatrix, [1, 2, 3])
  t.true(compareVectors(obs5, [2, -1, 3]))

  const errorMatrix = [
    0, 0, 0,-1,
    0, 0, 0, 1,
    0, 0, 0,-1,
    1, 1, 1, 1
  ]
  const obs6 = transform(errorMatrix, [1, 1, 1])
  t.true(compareVectors(obs6, [1, 1, 1]))
})
