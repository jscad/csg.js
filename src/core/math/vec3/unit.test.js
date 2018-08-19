const test = require('ava')
const {unit, fromValues, toString} = require('./index')

test('vec3: unit() called with one paramerter should return a vec3 with correct values', t => {
  const obs1 = unit([0, 0, 0])
  const exp1 = fromValues(0/0, 0/0, 0/0)
  t.deepEqual(obs1, exp1)

  const obs2 = unit([5, 0, 0])
  const exp2 = fromValues(1, 0, 0)
  t.deepEqual(obs2, exp2)

  const obs3 = unit([0, 5, 0])
  const exp3 = fromValues(0, 1, 0)
  t.deepEqual(obs3, exp3)

  const obs4 = unit([0, 0, 5])
  const exp4 = fromValues(0, 0, 1)
  t.deepEqual(obs4, exp4)

  const obs5 = unit([3, 4, 5])
  const exp5 = fromValues(0.424264073, 0.565685451, 0.707106769)
  t.deepEqual(obs5, exp5)
})

test('vec3: unit() called with three paramerters should update a vec3 with correct values', t => {
  let obs1 = fromValues(0, 0, 0)
  const ret1 = unit(obs1, [0, 0, 0])
  const exp1 = fromValues(0/0, 0/0, 0/0)
  t.deepEqual(obs1, exp1)
  t.deepEqual(ret1, exp1)

  let obs2 = fromValues(0, 0, 0)
  const ret2 = unit(obs2, [5, 0, 0])
  const exp2 = fromValues(1, 0, 0)
  t.deepEqual(obs2, exp2)
  t.deepEqual(ret2, exp2)

  let obs3 = fromValues(0, 0, 0)
  const ret3 = unit(obs3, [0, 5, 0])
  const exp3 = fromValues(0, 1, 0)
  t.deepEqual(obs3, exp3)
  t.deepEqual(ret3, exp3)

  let obs4 = fromValues(0, 0, 0)
  const ret4 = unit(obs4, [0, 0, 5])
  const exp4 = fromValues(0, 0, 1)
  t.deepEqual(obs4, exp4)
  t.deepEqual(ret4, exp4)

  let obs5 = fromValues(0, 0, 0)
  const ret5 = unit(obs5, [3, 4, 5])
  const exp5 = fromValues(0.424264073, 0.565685451, 0.707106769)
  t.deepEqual(obs5, exp5)
  t.deepEqual(ret5, exp5)
})
