const test = require('ava')
const {min, fromValues} = require('./index')

test('vec3: min() called with two parameters should return a vec3 with correct values', t => {
  const vec_a1 = fromValues(0, 0, 0)
  const vec_b1 = fromValues(0, 0, 0)
  const obs1 = min(vec_a1, vec_b1)
  t.deepEqual(obs1, vec_a1)

  const vec_b2 = fromValues(1, 1, 1)
  const obs2 = min(vec_a1, vec_b2)
  t.deepEqual(obs2, vec_a1)

  const vec_b3 = fromValues(0, 1, 1)
  const obs3 = min(vec_a1, vec_b3)
  t.deepEqual(obs3, vec_a1)

  const vec_b4 = fromValues(0, 0, 1)
  const obs4 = min(vec_a1, vec_b4)
  t.deepEqual(obs4, vec_a1)
})

test('vec3: min() called with three parameters should update a vec3 with correct values', t => {
  let obs1 = fromValues(0, 0, 0)
  const vec_a1 = fromValues(0, 0, 0)
  const vec_b1 = fromValues(0, 0, 0)
  const ret1 = min(obs1, vec_a1, vec_b1)
  t.deepEqual(obs1, vec_a1)
  t.deepEqual(ret1, vec_a1)

  let obs2 = fromValues(0, 0, 0)
  const vec_b2 = fromValues(1, 1, 1)
  const ret2 = min(obs2, vec_a1, vec_b2)
  t.deepEqual(obs2, vec_a1)
  t.deepEqual(ret2, vec_a1)

  let obs3 = fromValues(0, 0, 0)
  const vec_b3 = fromValues(0, 1, 1)
  const ret3 = min(obs3, vec_a1, vec_b3)
  t.deepEqual(obs3, vec_a1)
  t.deepEqual(ret3, vec_a1)

  let obs4 = fromValues(0, 0, 0)
  const vec_b4 = fromValues(0, 0, 1)
  const ret4 = min(obs4, vec_a1, vec_b4)
  t.deepEqual(obs4, vec_a1)
  t.deepEqual(ret4, vec_a1)
})
