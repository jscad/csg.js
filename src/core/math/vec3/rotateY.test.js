const test = require('ava')
const {rotateY, fromValues, toString} = require('./index')

test('vec3: rotateY() called with two paramerters should return a vec3 with correct values', t => {
  const radians = 90 * Math.PI / 180

  const obs1 = rotateY(0, [0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)

  const obs2 = rotateY(0, [1, 2, 3], [3, 2, 1])
  const exp2 = fromValues(3, 2, 1)
  t.deepEqual(obs2, exp2)

  const obs3 = rotateY(radians, [1, 2, 3], [-1, -2, -3])
  const exp3 = fromValues(-5.0000000, -2.0000000, 5.0000000)
  t.deepEqual(obs3, exp3)

  const obs4 = rotateY(-radians, [-1, -2, -3], [1, 2, 3])
  const exp4 = fromValues(-7.0000000, 2.0000000, -1.0000000)
  t.deepEqual(obs4, exp4)
})

test('vec3: rotateY() called with three paramerters should update a vec3 with correct values', t => {
  const radians = 90 * Math.PI / 180

  let obs1 = fromValues(0, 0, 0)
  const ret1 = rotateY(obs1, 0, [0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)
  t.deepEqual(ret1, exp1)

  let obs2 = fromValues(0, 0, 0)
  const ret2 = rotateY(obs2, 0, [1, 2, 3], [3, 2, 1])
  const exp2 = fromValues(3, 2, 1)
  t.deepEqual(obs2, exp2)
  t.deepEqual(ret2, exp2)

  let obs3 = fromValues(0, 0, 0)
  const ret3 = rotateY(obs3, radians, [1, 2, 3], [-1, -2, -3])
  const exp3 = fromValues(-5.0000000, -2.0000000, 5.0000000)
  t.deepEqual(obs3, exp3)
  t.deepEqual(ret3, exp3)

  let obs4 = fromValues(0, 0, 0)
  const ret4 = rotateY(obs4, -radians, [-1, -2, -3], [1, 2, 3])
  const exp4 = fromValues(-7.0000000, 2.0000000, -1.0000000)
  t.deepEqual(obs4, exp4)
  t.deepEqual(ret4, exp4)
})
