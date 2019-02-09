const test = require('ava')
const { multiply, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec2: multiply() called with two paramerters should return a vec2 with correct values', (t) => {
  const obs1 = multiply([0, 0], [0, 0])
  t.true(compareVectors(obs1, [0, 0]))

  const obs2 = multiply([0, 0], [1, 2])
  t.true(compareVectors(obs2, [0, 0]))

  const obs3 = multiply([6, 6], [1, 2])
  t.true(compareVectors(obs3, [6, 12]))

  const obs4 = multiply([-6, -6], [1, 2])
  t.true(compareVectors(obs4, [-6, -12]))

  const obs5 = multiply([6, 6], [-1, -2])
  t.true(compareVectors(obs5, [-6, -12]))

  const obs6 = multiply([-6, -6], [-1, -2])
  t.true(compareVectors(obs6, [6, 12]))
})
