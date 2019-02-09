const test = require('ava')
const { divide, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec2: divide() called with two paramerters should return a vec2 with correct values', (t) => {
  const obs1 = divide([0, 0], [0, 0])
  t.true(compareVectors(obs1, [0 / 0, 0 / 0]))

  const obs2 = divide([0, 0], [1, 2])
  t.true(compareVectors(obs2, [0, 0]))

  const obs3 = divide([6, 6], [1, 2])
  t.true(compareVectors(obs3, [6, 3]))

  const obs4 = divide([-6, -6], [1, 2])
  t.true(compareVectors(obs4, [-6, -3]))

  const obs5 = divide([6, 6], [-1, -2])
  t.true(compareVectors(obs5, [-6, -3]))

  const obs6 = divide([-6, -6], [-1, -2])
  t.true(compareVectors(obs6, [6, 3]))
})
