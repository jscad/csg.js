const test = require('ava')
const {scale, fromValues} = require('./index')

test.only('vec3: scale() called with two paramerters should return a vec3 with correct values', t => {

  const obs1 = scale(0, [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)

  const obs2 = scale(0, [1, 2, 3])
  const exp2 = fromValues(0, 0, 0)
  t.deepEqual(obs2, exp2)

  const obs3 = scale(6, [1, 2, 3])
  const exp3 = fromValues(6, 12, 18)
  t.deepEqual(obs3, exp3)

  const obs4 = scale(-6, [1, 2, 3])
  const exp4 = fromValues(-6, -12, -18)
  t.deepEqual(obs4, exp4)

  const obs5 = scale(6, [-1, -2, -3])
  const exp5 = fromValues(-6, -12, -18)
  t.deepEqual(obs5, exp5)

  const obs6 = scale(-6, [-1, -2, -3])
  const exp6 = fromValues(6, 12, 18)
  t.deepEqual(obs6, exp6)
})

test.only('vec3: scale() called with three paramerters should update a vec3 with correct values', t => {
  let obs1 = fromValues(0, 0, 0)
  const ret1 = scale(obs1, 0, [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)
  t.deepEqual(ret1, exp1)

  let obs2 = fromValues(0, 0, 0)
  const ret2 = scale(obs2, 0, [1, 2, 3])
  const exp2 = fromValues(0, 0, 0)
  t.deepEqual(obs2, exp2)
  t.deepEqual(ret2, exp2)

  let obs3 = fromValues(0, 0, 0)
  const ret3 = scale(obs3, 6, [1, 2, 3])
  const exp3 = fromValues(6, 12, 18)
  t.deepEqual(obs3, exp3)
  t.deepEqual(ret3, exp3)

  let obs4 = fromValues(0, 0, 0)
  const ret4 = scale(obs4, -6, [1, 2, 3])
  const exp4 = fromValues(-6, -12, -18)
  t.deepEqual(obs4, exp4)
  t.deepEqual(ret4, exp4)

  let obs5 = fromValues(0, 0, 0)
  const ret5 = scale(obs5, 6, [-1, -2, -3])
  const exp5 = fromValues(-6, -12, -18)
  t.deepEqual(obs5, exp5)
  t.deepEqual(ret5, exp5)

  let obs6 = fromValues(0, 0, 0)
  const ret6 = scale(obs6, -6, [-1, -2, -3])
  const exp6 = fromValues(6, 12, 18)
  t.deepEqual(obs6, exp6)
  t.deepEqual(ret6, exp6)
})
