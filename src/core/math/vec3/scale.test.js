const test = require('ava')
const { scale, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec3: scale() called with two paramerters should return a vec3 with correct values', (t) => {
  const obs1 = scale(0, [0, 0, 0])
  t.true(compareVectors(obs1, [0, 0, 0]))

  const obs2 = scale(0, [1, 2, 3])
  t.true(compareVectors(obs2, [0, 0, 0]))

  const obs3 = scale(6, [1, 2, 3])
  t.true(compareVectors(obs3, [6, 12, 18]))

  const obs4 = scale(-6, [1, 2, 3])
  t.true(compareVectors(obs4, [-6, -12, -18]))

  const obs5 = scale(6, [-1, -2, -3])
  t.true(compareVectors(obs5, [-6, -12, -18]))

  const obs6 = scale(-6, [-1, -2, -3])
  t.true(compareVectors(obs6, [6, 12, 18]))
})
