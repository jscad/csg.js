const test = require('ava')
const { lerp, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec3: lerp() called with two paramerters should return a vec3 with correct values', (t) => {
  const obs1 = lerp(0, [0, 0, 0], [0, 0, 0])
  t.true(compareVectors(obs1, [0, 0, 0]))

  const obs2 = lerp(0.00, [1, 2, 3], [5, 6, 7])
  t.true(compareVectors(obs2, [1, 2, 3]))

  const obs3 = lerp(0.75, [1, 2, 3], [5, 6, 7])
  t.true(compareVectors(obs3, [4, 5, 6]))

  const obs4 = lerp(1.00, [1, 2, 3], [5, 6, 7])
  t.true(compareVectors(obs4, [5, 6, 7]))
})
