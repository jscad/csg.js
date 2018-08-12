const test = require('ava')
const {normalize, fromValues} = require('./index')

test('vec3: normalize() called with one paramerters should return a vec3 with correct values', t => {
  const obs1 = normalize([0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)

  const obs2 = normalize([1, 2, 3])
  const exp2 = fromValues(0.267261237, 0.534522474, 0.801783741)
  t.deepEqual(obs2, exp2)

  const obs3 = normalize([-1, -2, -3])
  const exp3 = fromValues(-0.267261237, -0.534522474, -0.801783741)
  t.deepEqual(obs3, exp3)

  const obs4 = normalize([-1, 2, -3])
  const exp4 = fromValues(-0.267261237, 0.534522474, -0.801783741)
  t.deepEqual(obs4, exp4)
})

test('vec3: normalize() called with two paramerters should update a vec3 with correct values', t => {
  let obs1 = fromValues(0, 0, 0)
  const ret1 = normalize(obs1, [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)
  t.deepEqual(ret1, exp1)

  let obs2 = fromValues(0, 0, 0)
  const ret2 = normalize(obs2, [1, 2, 3])
  const exp2 = fromValues(0.267261237, 0.534522474, 0.801783741)
  t.deepEqual(obs2, exp2)
  t.deepEqual(ret2, exp2)

  let obs3 = fromValues(0, 0, 0)
  const ret3 = normalize(obs3, [-1, -2, -3])
  const exp3 = fromValues(-0.267261237, -0.534522474, -0.801783741)
  t.deepEqual(obs3, exp3)
  t.deepEqual(ret3, exp3)

  let obs4 = fromValues(0, 0, 0)
  const ret4 = normalize(obs4, [-1, 2, -3])
  const exp4 = fromValues(-0.267261237, 0.534522474, -0.801783741)
  t.deepEqual(obs4, exp4)
  t.deepEqual(ret4, exp4)
})
