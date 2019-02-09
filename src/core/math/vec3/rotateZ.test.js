const test = require('ava')
const { rotateZ, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec3: rotateZ() called with two paramerters should return a vec3 with correct values', (t) => {
  const radians = 90 * Math.PI / 180

  const obs1 = rotateZ(0, [0, 0, 0], [0, 0, 0])
  t.true(compareVectors(obs1, [0, 0, 0]))

  const obs2 = rotateZ(0, [1, 2, 3], [3, 2, 1])
  t.true(compareVectors(obs2, [3, 2, 1]))

  const obs3 = rotateZ(radians, [1, 2, 3], [-1, -2, -3])
  // FIXME t.true(compareVectors(obs3, [5, -0, -3]))

  const obs4 = rotateZ(-radians, [-1, -2, -3], [1, 2, 3])
  t.true(compareVectors(obs4, [3, -4, 3]))
})
