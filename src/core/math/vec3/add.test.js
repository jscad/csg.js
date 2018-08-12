const test = require('ava')
const {add, fromValues} = require('./index')

test('vec3: add() called with two paramerters should return a vec3 with correct values', t => {
  const obs1 = add([0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)

  const obs2 = add([1, 2, 3], [3, 2, 1])
  const exp2 = fromValues(4, 4, 4)
  t.deepEqual(obs2, exp2)

  const obs3 = add([1, 2, 3], [-1, -2, -3])
  const exp3 = fromValues(0, 0, 0)
  t.deepEqual(obs3, exp3)

  const obs4 = add([-1, -2, -3], [-1, -2, -3])
  const exp4 = fromValues(-2, -4, -6)
  t.deepEqual(obs4, exp4)
})

test('vec3: add() called with three paramerters should update a vec3 with correct values', t => {
  let obs1 = fromValues(0, 0, 0)
  const ret1 = add(obs1, [0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)
  t.deepEqual(ret1, exp1)

  let obs2 = fromValues(0, 0, 0)
  const ret2 = add(obs2, [1, 2, 3], [3, 2, 1])
  const exp2 = fromValues(4, 4, 4)
  t.deepEqual(obs2, exp2)
  t.deepEqual(ret2, exp2)

  let obs3 = fromValues(0, 0, 0)
  const ret3 = add(obs3, [1, 2, 3], [-1, -2, -3])
  const exp3 = fromValues(0, 0, 0)
  t.deepEqual(obs3, exp3)
  t.deepEqual(ret3, exp3)

  let obs4 = fromValues(0, 0, 0)
  const ret4 = add(obs4, [-1, -2, -3], [-1, -2, -3])
  const exp4 = fromValues(-2, -4, -6)
  t.deepEqual(obs4, exp4)
  t.deepEqual(ret4, exp4)
})
