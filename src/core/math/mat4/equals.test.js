const test = require('ava')
const {equals, fromValues} = require('./index')

test('vec3: equals() should return correct booleans', t => {
  let vec_a = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  let vec_b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  t.true(equals(vec_a, vec_b))

  let vec_b0 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b0))

  let vec_b1 = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b1))

  let vec_b2 = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b2))

  let vec_b3 = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b3))

  let vec_b4 = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b4))

  let vec_b5 = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b5))

  let vec_b6 = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b6))

  let vec_b7 = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b7))

  let vec_b8 = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b8))

  let vec_b9 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b9))

  let vec_b10 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b10))

  let vec_b11 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
  t.false(equals(vec_a, vec_b11))

  let vec_b12 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
  t.false(equals(vec_a, vec_b12))

  let vec_b13 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
  t.false(equals(vec_a, vec_b13))

  let vec_b14 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
  t.false(equals(vec_a, vec_b14))

  let vec_b15 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  t.false(equals(vec_a, vec_b15))
})
