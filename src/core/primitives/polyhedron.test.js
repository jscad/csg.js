const test = require('ava')

const generatePolyhedron = require('./generatePolyhedron')

const { compareVectors } = require('../../../test/helpers/index')

test('generation: generatePolyhedron() should generate 3D shapes from options', (t) => {
  const s1 = generatePolyhedron({faces: [], vertices: []})
  t.true(true)

  let vertices = [
            [5, 5, 0],
            [5, -5, 0],
            [-5, -5, 0],
            [-5, 5, 0],
            [0, 0, 5]
  ]
  let faces = [
            [0, 1, 4],
            [1, 2, 4],
            [2, 3, 4],
            [3, 0, 4],
            [1, 0, 3],
            [2, 1, 3]
  ]
  const s2 = generatePolyhedron({faces: faces, vertices: vertices})

  //t.not(obs1, org1)
})

