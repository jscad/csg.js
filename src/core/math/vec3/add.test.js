const test = require('ava')
const { add, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec3: add() called with two paramerters should return a vec3 with correct values', (t) => {
  const obs1 = add([0, 0, 0], [0, 0, 0])
  t.true(compareVectors(obs1, [0, 0, 0]))

  const obs2 = add([1, 2, 3], [3, 2, 1])
  t.true(compareVectors(obs2, [4, 4, 4]))

  const obs3 = add([1, 2, 3], [-1, -2, -3])
  t.true(compareVectors(obs3, [0, 0, 0]))

  const obs4 = add([-1, -2, -3], [-1, -2, -3])
  t.true(compareVectors(obs4, [-2, -4, -6]))
})
