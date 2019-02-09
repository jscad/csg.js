const test = require('ava')
const { normalize, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec3: normalize() called with one paramerters should return a vec3 with correct values', (t) => {
  const obs1 = normalize([0, 0, 0])
  t.true(compareVectors(obs1, [0, 0, 0]))

  const obs2 = normalize([1, 2, 3])
  t.true(compareVectors(obs2, [0.26726123690605164, 0.5345224738121033, 0.8017837405204773]))

  const obs3 = normalize([-1, -2, -3])
  t.true(compareVectors(obs3, [-0.26726123690605164, -0.5345224738121033, -0.8017837405204773]))

  const obs4 = normalize([-1, 2, -3])
  t.true(compareVectors(obs4, [-0.26726123690605164, 0.5345224738121033, -0.8017837405204773]))
})
