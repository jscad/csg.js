const test = require('ava')
const {length, fromValues} = require('./index')

const {nearlyEqual} = require('../../../../test/helpers/index')
const {EPS} = require('../../constants')

test('vec2: length() should return correct values', t => {
  const vec_a1 = fromValues(0, 0)
  const length1 = length(vec_a1)
  nearlyEqual(t, length1, 0.0, EPS)

  const vec_a2 = fromValues(1, 2)
  const length2 = length(vec_a2)
  nearlyEqual(t, length2, 2.23606, EPS)

  const vec_a3 = fromValues(1, -2)
  const length3 = length(vec_a3)
  nearlyEqual(t, length3, 2.23606, EPS)

  const vec_a4 = fromValues(-1, -2)
  const length4 = length(vec_a4)
  nearlyEqual(t, length4, 2.23606, EPS)

  const vec_a5 = fromValues(-1, 2)
  const length5 = length(vec_a5)
  nearlyEqual(t, length5, 2.23606, EPS)

  t.true(true)
})
