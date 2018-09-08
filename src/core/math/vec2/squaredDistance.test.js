const test = require('ava')
const {squaredDistance, fromValues} = require('./index')

const {nearlyEqual} = require('../../../../test/helpers/index')
const {EPS} = require('../../constants')

test('vec2: squaredDistance() should return correct values', t => {
  const vec_a1 = fromValues(0, 0)
  const vec_b1 = fromValues(0, 0)
  const distance1 = squaredDistance(vec_a1, vec_b1)
  nearlyEqual(t, distance1, 0.0, EPS)

  const vec_b2 = fromValues(1, 2)
  const distance2 = squaredDistance(vec_a1, vec_b2)
  nearlyEqual(t, distance2, 5.00000, EPS)

  const vec_b3 = fromValues(1, -2)
  const distance3 = squaredDistance(vec_a1, vec_b3)
  nearlyEqual(t, distance3, 5.00000, EPS)

  const vec_b4 = fromValues(-1, -2)
  const distance4 = squaredDistance(vec_a1, vec_b4)
  nearlyEqual(t, distance4, 5.00000, EPS)

  const vec_b5 = fromValues(-1, 2)
  const distance5 = squaredDistance(vec_a1, vec_b5)
  nearlyEqual(t, distance5, 5.00000, EPS)

  t.true(true)
})
