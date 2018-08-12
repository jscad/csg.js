const test = require('ava')
const {clone, fromValues} = require('./index')

test('vec3: clone() should return a new vec3 with same values', t => {
  const org1 = fromValues(0, 0, 0)
  const obs1 = clone(org1)
  t.deepEqual(obs1, org1)
  t.not(obs1, org1)

  const org2 = fromValues(1, 2, 3)
  const obs2 = clone(org2)
  t.deepEqual(obs2, org2)
  t.not(obs2, org2)

  const org3 = fromValues(-1, -2, -3)
  const obs3 = clone(org3)
  t.deepEqual(obs3, org3)
  t.not(obs3, org3)
})
