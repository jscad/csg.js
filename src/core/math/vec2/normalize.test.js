const test = require('ava')
const { normalize, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec2: normalize() called with one paramerters should return a vec2 with correct values', (t) => {
  const obs1 = normalize([0, 0])
  t.true(compareVectors(obs1, [0, 0]))

  const obs2 = normalize([1, 2])
  t.true(compareVectors(obs2, [0.4472135901451111, 0.8944271802902222]))

  const obs3 = normalize([-1, -2])
  t.true(compareVectors(obs3, [-0.4472135901451111, -0.8944271802902222]))

  const obs4 = normalize([-1, 2])
  t.true(compareVectors(obs4, [-0.4472135901451111, 0.8944271802902222]))
})
