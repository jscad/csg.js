const canonicalize = require('./canonicalize')
const retesselate = require('./retesselate')
const toGeom3Wall = require('./toGeom3Wall')

const difference = shapes => {
  const [shape, otherShapes] = [shapes[0], ...shapes]
  let result = toGeom3Wall(shape, -1, 1)
  otherShapes.map(shape => {
    result = subtractSub(result, toGeom3Wall(shape, -1, 1), false, false)
  })
  result = retesselate(result)
  result = canonicalize(result)
  result = fromFakeCSG(result)
  result = canonicalize(result)
  return result
}

module.exports = difference
