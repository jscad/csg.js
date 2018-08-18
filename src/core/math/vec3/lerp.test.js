const test = require('ava')
const {lerp, fromValues, toString} = require('./index')

test.only('vec3: lerp() called with two paramerters should return a vec3 with correct values', t => {

  const obs1 = lerp(0, [0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)

  const obs2 = lerp(0.00, [1, 2, 3], [5, 6, 7])
  const exp2 = fromValues(1.000000000, 2.000000000, 3.000000000)
  t.deepEqual(obs2, exp2)

  const obs3 = lerp(0.75, [1, 2, 3], [5, 6, 7])
  const exp3 = fromValues(4.000000000, 5.000000000, 6.000000000)
  t.deepEqual(obs3, exp3)

  const obs4 = lerp(1.00, [1, 2, 3], [5, 6, 7])
  const exp4 = fromValues(5.000000000, 6.000000000, 7.000000000)
  t.deepEqual(obs4, exp4)
})

test.only('vec3: lerp() called with three paramerters should update a vec3 with correct values', t => {
  let obs1 = fromValues(0, 0, 0)
  const ret1 = lerp(obs1, 0, [0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)
  t.deepEqual(ret1, exp1)

  let obs2 = fromValues(0, 0, 0)
  const ret2 = lerp(obs2, 0.00, [1, 2, 3], [5, 6, 7])
  const exp2 = fromValues(1.000000000, 2.000000000, 3.000000000)
  t.deepEqual(obs2, exp2)
  t.deepEqual(ret2, exp2)

  let obs3 = fromValues(0, 0, 0)
  const ret3 = lerp(obs3, 0.75, [1, 2, 3], [5, 6, 7])
  const exp3 = fromValues(4.000000000, 5.000000000, 6.000000000)
  t.deepEqual(obs3, exp3)
  t.deepEqual(ret3, exp3)

  let obs4 = fromValues(0, 0, 0)
  const ret4 = lerp(obs4, 1.00, [1, 2, 3], [5, 6, 7])
  const exp4 = fromValues(5.000000000, 6.000000000, 7.000000000)
  t.deepEqual(obs4, exp4)
  t.deepEqual(ret4, exp4)
})
