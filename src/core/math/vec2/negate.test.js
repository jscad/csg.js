const test = require('ava')
const { negate, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec2: negate() called with one paramerters should return a vec2 with correct values', (t) => {
  const obs1 = negate([0, 0])
  t.true(compareVectors(obs1, [0, 0]))

  const obs2 = negate([1, 2])
  t.true(compareVectors(obs2, [-1, -2]))

  const obs3 = negate([-1, -2])
  t.true(compareVectors(obs3, [1, 2]))

  const obs4 = negate([-1, 2])
  t.true(compareVectors(obs4, [1, -2]))
})
