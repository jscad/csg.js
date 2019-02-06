const canonicalize = require('./canonicalize')
const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')

// a simple triangle
const triangle = [[0, 0, 0], [0, 1, 0], [0, 1, 1]]

test('canonicalize: Is idemponent', t => {
  const solid1 = fromPolygonArray({}, [triangle])
  const solid2 = fromPolygonArray({}, [triangle])
  t.deepEqual(canonicalize(solid1), canonicalize(canonicalize(solid2)))
})
