const test = require('ava')
const {random, fromValues} = require('./index')

test('vec3: random() should return a vec3 with correct values', t => {
  const obs1 = random([0, 0, 0])
  const exp1 = fromValues(1, 0, 0)
  t.deepEqual(obs1, exp1)

  const obs2 = random([3, 1, 3])
  const exp2 = fromValues(0, 1, 0)
  t.deepEqual(obs2, exp2)

  const obs3 = random([3, 2, 1])
  const exp3 = fromValues(0, 0, 1)
  t.deepEqual(obs3, exp3)
})
