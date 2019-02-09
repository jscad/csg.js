const test = require('ava')
const generateCuboid = require('./generateCuboid')

const { compareVectors } = require('../../../test/helpers/index')

test('generation: generateCuboid() should generate 3D shapes from options', (t) => {
  const s1 = generateCuboid({center: [0, 0, 0], radius: [1, 1, 1]})
  t.true(true)
  //t.not(obs1, org1)

  const s2 = generateCuboid({center: [3, 3, 3], radius: [1, 1, 1]})

  const s3 = generateCuboid({center: [-3, -3, -3], radius: [1, 1, 1]})

  const s4 = generateCuboid({center: [0, 0, 0], radius: [3, 6, 9]})
})
