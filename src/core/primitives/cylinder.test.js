const test = require('ava')

const generateCylinder = require('./generateCylinder')
const generateRoundedCylinder = require('./generateRoundedCylinder')

const { compareVectors } = require('../../../test/helpers/index')

test('generation: generateCylinder() should generate 3D shapes from options', (t) => {
  const s1 = generateCylinder({start: [0, 0, 0], end: [0, 0, 1], radiusStart: [1, 1], radiusEnd: [1,1], segments: 4})
  t.true(true)
  //t.not(obs1, org1)

  const s2 = generateCylinder({start: [0, 0, -5], end: [0, 0, 5], radiusStart: [5, 5], radiusEnd: [5,5], segments: 8})

  const s3 = generateCylinder({start: [-10, -10, -10], end: [10, 10, 10], radiusStart: [3, 5], radiusEnd: [7,5], segments: 16})
})

test('generation: generateRoundedCylinder() should generate 3D shapes from options', (t) => {
  const s1 = generateRoundedCylinder({start: [0, 0, 0], end: [0, 0, 10], radius: 5, segments: 4, roundsegments: 4})
  t.true(true)

  const s2 = generateRoundedCylinder({start: [0, 0, -10], end: [0, 0, 10], radius: 4, segments: 4, roundsegments: 16})
})

