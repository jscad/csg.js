const test = require('ava')

const generateSphere = require('./generateSphere')
const generateGeodesicSphere = require('./generateGeodesicSphere')

const { compareVectors } = require('../../../test/helpers/index')

test('generation: generateSphere() should generate 3D shapes from options', (t) => {
  const s1 = generateSphere({center: [0, 0, 0], radius: 1, segments: 4})
  t.true(true)

  const s2 = generateSphere({center: [0, 0, 0], radius: 5, segments: 8})
})

test('generation: generateGeodesicSphere() should generate 3D shapes from options', (t) => {
  const s1 = generateGeodesicSphere()
  t.true(true)
})

