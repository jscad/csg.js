const canonicalize = require('./canonicalize')

const difference = shapes => {
  const [shape, otherShapes] = [shapes[0], ...shapes]
  let result = toShape3Wall(shape, -1, 1)
  otherShapes.map(shape => {
    result = subtractSub(result, toShape3Wall(shape, -1, 1), false, false)
  })
  result = retesselate(result)
  result = canonicalize(result)
  result = fromFakeCSG(result)
  result = canonicalize(result)
  return result
}

module.exports = difference
