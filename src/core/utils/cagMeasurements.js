const Vector2D = require('../math/Vector2')

// Calculate the area of the give CAG (a closed convex 2D polygon)
// For a counter clockwise rotating polygon (about Z) the area is positive, otherwise negative.
// See http://paulbourke.net/geometry/polygonmesh/
const area = function (cag) {
  let polygonArea = 0
  cag.sides.map(function (side) {
    polygonArea += side.vertex0.pos.cross(side.vertex1.pos)
  })
  polygonArea *= 0.5
  return polygonArea
}

const getBounds = function (cag) {
  let minpoint
  if (cag.sides.length === 0) {
    minpoint = new Vector2D(0, 0)
  } else {
    minpoint = cag.sides[0].vertex0.pos
  }
  let maxpoint = minpoint
  cag.sides.map(function (side) {
    minpoint = minpoint.min(side.vertex0.pos)
    minpoint = minpoint.min(side.vertex1.pos)
    maxpoint = maxpoint.max(side.vertex0.pos)
    maxpoint = maxpoint.max(side.vertex1.pos)
  })
  return [minpoint, maxpoint]
}

module.exports = {area, getBounds}
