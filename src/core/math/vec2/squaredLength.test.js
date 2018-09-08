const test = require('ava')
const {squaredLength, fromValues} = require('./index')

const {nearlyEqual} = require('../../../../test/helpers/index')
const {EPS} = require('../../constants')

test('vec2: length() should return correct values', t => {
  const vec_a1 = fromValues(0, 0)
  const length1 = squaredLength(vec_a1)
  nearlyEqual(t, length1, 0.0, EPS)

  const vec_a2 = fromValues(1, 2)
  const length2 = squaredLength(vec_a2)
  nearlyEqual(t, length2, 5.00000, EPS)

  const vec_a3 = fromValues(1, -2)
  const length3 = squaredLength(vec_a3)
  nearlyEqual(t, length3, 5.00000, EPS)

  const vec_a4 = fromValues(-1, -2)
  const length4 = squaredLength(vec_a4)
  nearlyEqual(t, length4, 5.00000, EPS)

  const vec_a5 = fromValues(-1, 2)
  const length5 = squaredLength(vec_a5)
  nearlyEqual(t, length5, 5.00000, EPS)

  t.true(true)
})
