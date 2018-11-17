const { min, create, max } = require('../../math/vec2')

const getBounds = geometry => {
  let minPoint = geometry.sides.length === 0 ? create() : [geometry.sides[0][0][0], geometry.sides[0][0][1]]
  let maxPoint = minPoint
  geometry.sides.forEach(side => {
    minPoint = min(minPoint, side[0])
    minPoint = min(minPoint, side[1])
    maxPoint = max(maxPoint, side[0])
    maxPoint = max(maxPoint, side[1])
  })
  return [minPoint, maxPoint]
}

module.exports = getBounds
