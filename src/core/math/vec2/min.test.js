const test = require('ava')
const { min, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec2: min() called with two parameters should return a vec2 with correct values', (t) => {
  const vec0 = fromValues(0, 0)
  const vec1 = fromValues(0, 0)
  const obs1 = min(vec0, vec1)
  t.true(compareVectors(obs1, [0, 0]))

  const vec2 = fromValues(1, 1)
  const obs2 = min(vec0, vec2)
  t.true(compareVectors(obs2, [0, 0]))

  const vec3 = fromValues(0, 1)
  const obs3 = min(vec0, vec3)
  t.true(compareVectors(obs3, [0, 0]))

  const vec4 = fromValues(0, 0)
  const obs4 = min(vec0, vec4)
  t.true(compareVectors(obs4, [0, 0]))
})
