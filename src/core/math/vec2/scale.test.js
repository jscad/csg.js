const test = require('ava')
const { scale, create } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec2: scale() should return a vec2 with positive values', (t) => {
  const obs1 = scale(0, [0, 0])
  t.true(compareVectors(obs1, [0, 0]))

  const obs2 = scale(3, [1, 2])
  t.true(compareVectors(obs2, [3, 6]))

  const obs3 = scale(3, [-1, -2])
  t.true(compareVectors(obs3, [-3, -6]))
})
