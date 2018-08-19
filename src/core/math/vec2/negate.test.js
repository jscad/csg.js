const test = require('ava')
const {negate, fromValues} = require('./index')

test('vec2: negate() called with one paramerters should return a vec2 with correct values', t => {
  const obs1 = negate([0, 0])
  const exp1 = fromValues(-0, -0) // MINUS ZERO
  t.deepEqual(obs1, exp1)

  const obs2 = negate([1, 2])
  const exp2 = fromValues(-1, -2)
  t.deepEqual(obs2, exp2)

  const obs3 = negate([-1, -2])
  const exp3 = fromValues(1, 2)
  t.deepEqual(obs3, exp3)

  const obs4 = negate([-1, 2])
  const exp4 = fromValues(1, -2)
  t.deepEqual(obs4, exp4)
})

test('vec2: negate() called with two paramerters should update a vec2 with correct values', t => {
  let obs1 = fromValues(0, 0)
  const ret1 = negate(obs1, [0, 0])
  const exp1 = fromValues(-0, -0) // MINUS ZERO
  t.deepEqual(obs1, exp1)
  t.deepEqual(ret1, exp1)

  let obs2 = fromValues(0, 0)
  const ret2 = negate(obs2, [1, 2])
  const exp2 = fromValues(-1, -2)
  t.deepEqual(obs2, exp2)
  t.deepEqual(ret2, exp2)

  let obs3 = fromValues(0, 0)
  const ret3 = negate(obs3, [-1, -2])
  const exp3 = fromValues(1, 2)
  t.deepEqual(obs3, exp3)
  t.deepEqual(ret3, exp3)

  let obs4 = fromValues(0, 0)
  const ret4 = negate(obs4, [-1, 2])
  const exp4 = fromValues(1, -2)
  t.deepEqual(obs4, exp4)
  t.deepEqual(ret4, exp4)
})
