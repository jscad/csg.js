const test = require('ava')
const { max, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec2: max() called with two parameters should return a vec2 with correct values', (t) => {
  const vec0 = fromValues(0, 0)
  const vec1 = fromValues(0, 0)
  const obs1 = max(vec0, vec1)
  t.true(compareVectors(obs1, [0, 0]))

  const vec2 = fromValues(1, 1)
  const obs2 = max(vec0, vec2)
  t.true(compareVectors(obs2, [1, 1]))

  const vec3 = fromValues(0, 1)
  const obs3 = max(vec0, vec3)
  t.true(compareVectors(obs3, [0, 1]))

  const vec4 = fromValues(0, 0)
  const obs4 = max(vec0, vec4)
  t.true(compareVectors(obs4, [0, 0]))
})
