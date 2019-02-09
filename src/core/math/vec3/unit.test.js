const test = require('ava')
const { unit, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec3: unit() called with one paramerter should return a vec3 with correct values', (t) => {
  const obs1 = unit([0, 0, 0])
  t.true(compareVectors(obs1, [0 / 0, 0 / 0, 0 / 0]))

  const obs2 = unit([5, 0, 0])
  t.true(compareVectors(obs2, [1, 0, 0]))

  const obs3 = unit([0, 5, 0])
  t.true(compareVectors(obs3, [0, 1, 0]))

  const obs4 = unit([0, 0, 5])
  t.true(compareVectors(obs4, [0, 0, 1]))

  const obs5 = unit([3, 4, 5])
  t.true(compareVectors(obs5, [0.4242640733718872, 0.5656854510307312, 0.7071067690849304]))
})
