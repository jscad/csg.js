const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const mat4 = require('../../math/mat4')
const test = require('ava')
const toPolygonArray = require('./toPolygonArray')
const transform = require('./transform')

// Transforms are tested in ../../math/ma4, so we really just need to
// demonstrate that application occurs.

const trianglePoints = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]

test('Solid transformed by identity matrix equals original solid.', t => {
  const triangle = fromPolygonArray({}, [trianglePoints])

  t.true(equals(transform(mat4.identity(), triangle), triangle))
})

test('Transform translates points as expected.', t => {
  const triangle = fromPolygonArray({}, [trianglePoints])
  const translated = trianglePoints.map(point => point.map(value => value + 1))

  t.deepEqual(toPolygonArray({}, transform(mat4.fromTranslation([1, 1, 1]),
                                           triangle)),
              [translated])
})
