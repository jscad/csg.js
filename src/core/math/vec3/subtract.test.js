const test = require('ava')
const { subtract, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec3: subtract() called with two paramerters should return a vec3 with correct values', (t) => {
  const obs1 = subtract([0, 0, 0], [0, 0, 0])
  t.true(compareVectors(obs1, [0, 0, 0]))

  const obs2 = subtract([1, 2, 3], [3, 2, 1])
  t.true(compareVectors(obs2, [-2, 0, 2]))

  const obs3 = subtract([1, 2, 3], [-1, -2, -3])
  t.true(compareVectors(obs3, [2, 4, 6]))

  const obs4 = subtract([-1, -2, -3], [-1, -2, -3])
  t.true(compareVectors(obs4, [0, 0, 0]))
})
