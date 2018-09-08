const test = require('ava')
const {distance, fromValues} = require('./index')

const {nearlyEqual} = require('../../../../test/helpers/index')
const {EPS} = require('../../constants')

test('vec2: distance() should return correct values', t => {
  const vec_a1 = fromValues(0, 0)
  const vec_b1 = fromValues(0, 0)
  const distance1 = distance(vec_a1, vec_b1)
  nearlyEqual(t, distance1, 0.0, EPS)

  const vec_b2 = fromValues(1, 2)
  const distance2 = distance(vec_a1, vec_b2)
  nearlyEqual(t, distance2, 2.23606, EPS)

  const vec_b3 = fromValues(1, -2)
  const distance3 = distance(vec_a1, vec_b3)
  nearlyEqual(t, distance3, 2.23606, EPS)

  const vec_b4 = fromValues(-1, -2)
  const distance4 = distance(vec_a1, vec_b4)
  nearlyEqual(t, distance4, 2.23606, EPS)

  const vec_b5 = fromValues(-1, 2)
  const distance5 = distance(vec_a1, vec_b5)
  nearlyEqual(t, distance5, 2.23606, EPS)

  t.true(true)
})
