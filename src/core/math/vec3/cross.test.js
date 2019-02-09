const test = require('ava')
const { cross, fromValues } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec3: cross() called with two paramerters should return a vec3 with correct values', (t) => {
  const obs1 = cross([0, 0, 0], [0, 0, 0])
  t.true(compareVectors(obs1, [0, 0, 0]))

  const obs2 = cross([5, 5, 5], [10, 20, 30])
  t.true(compareVectors(obs2, [50, -100, 50]))

  const obs3 = cross([5, 5, 5], [10, -20, 30])
  t.true(compareVectors(obs3, [250, -100, -150]))

  const obs4 = cross([5, 5, 5], [-10, -20, 30])
  t.true(compareVectors(obs4, [250, -200, -50]))

  const obs5 = cross([5, 5, 5], [-10, 20, 30])
  t.true(compareVectors(obs5, [50, -200, 150]))

  const obs6 = cross([5, 5, 5], [10, 20, -30])
  t.true(compareVectors(obs6, [-250, 200, 50]))

  const obs7 = cross([5, 5, 5], [10, -20, -30])
  t.true(compareVectors(obs7, [-50, 200, -150]))

  const obs8 = cross([5, 5, 5], [-10, -20, -30])
  t.true(compareVectors(obs8, [-50, 100, -50]))

  const obs9 = cross([5, 5, 5], [-10, 20, -30])
  t.true(compareVectors(obs9, [-250, 100, 150]))
})
