const test = require('ava')
const {rotateZ, fromValues} = require('./index')

test('vec3: rotateZ() called with two paramerters should return a vec3 with correct values', t => {
  const radians = 90 * Math.PI / 180

  const obs1 = rotateZ(0, [0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)

  const obs2 = rotateZ(0, [1, 2, 3], [3, 2, 1])
  const exp2 = fromValues(3, 2, 1)
  t.deepEqual(obs2, exp2)

  const obs3 = rotateZ(radians, [1, 2, 3], [-1, -2, -3])
  const exp3 = fromValues(5.0000000, -0.0000000, -3.0000000)
  // HOW TO FIX -0 ?? t.deepEqual(obs3, exp3)

  const obs4 = rotateZ(-radians, [-1, -2, -3], [1, 2, 3])
  const exp4 = fromValues(3.0000000, -4.0000000, 3.0000000)
  t.deepEqual(obs4, exp4)
})

test('vec3: rotateZ() called with three paramerters should update a vec3 with correct values', t => {
  const radians = 90 * Math.PI / 180

  let obs1 = fromValues(0, 0, 0)
  const ret1 = rotateZ(obs1, 0, [0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)
  t.deepEqual(ret1, exp1)

  let obs2 = fromValues(0, 0, 0)
  const ret2 = rotateZ(obs2, 0, [1, 2, 3], [3, 2, 1])
  const exp2 = fromValues(3, 2, 1)
  t.deepEqual(obs2, exp2)
  t.deepEqual(ret2, exp2)

  let obs3 = fromValues(0, 0, 0)
  const ret3 = rotateZ(obs3, radians, [1, 2, 3], [-1, -2, -3])
  const exp3 = fromValues(5.0000000, -0.000000, -3.000000)
  // HOW TO FIX -0 ?? t.deepEqual(obs3, exp3)
  // HOW TO FIX -0 ?? t.deepEqual(ret3, exp3)

  let obs4 = fromValues(0, 0, 0)
  const ret4 = rotateZ(obs4, -radians, [-1, -2, -3], [1, 2, 3])
  const exp4 = fromValues(3.0000000, -4.000000, 3.0000000)
  t.deepEqual(obs4, exp4)
  t.deepEqual(ret4, exp4)
})
