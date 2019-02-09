const test = require('ava')
const { cross } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('vec2: cross() called with two paramerters should return a vec2 with correct values', (t) => {
  const obs1 = cross([0, 0], [0, 0])
  t.true(compareVectors(obs1, [0, 0, 0]))

  const obs2 = cross([5, 5], [10, 20])
  t.true(compareVectors(obs2, [0, 0, 50]))

  const obs3 = cross([5, 5], [10, -20])
  t.true(compareVectors(obs3, [0, 0, -150]))

  const obs4 = cross([5, 5], [-10, -20])
  t.true(compareVectors(obs4, [0, 0, -50]))

  const obs5 = cross([5, 5], [-10, 20])
  t.true(compareVectors(obs5, [0, 0, 150]))

  const obs6 = cross([5, 5], [10, 20])
  t.true(compareVectors(obs6, [0, 0, 50]))

  const obs7 = cross([5, 5], [10, -20])
  t.true(compareVectors(obs7, [0, 0, -150]))

  const obs8 = cross([5, 5], [-10, -20])
  t.true(compareVectors(obs8, [0, 0, -50]))

  const obs9 = cross([5, 5], [-10, 20])
  t.true(compareVectors(obs9, [0, 0, 150]))
})
