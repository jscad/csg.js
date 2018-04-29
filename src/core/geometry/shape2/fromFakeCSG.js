const fromSides = require('./fromSides')
const Side = require('./math/Side')

// Converts a CSG to a  The CSG must consist of polygons with only z coordinates +1 and -1
// as constructed by _toCSGWall(-1, 1). This is so we can use the 3D union(), intersect() etc
const fromFakeCSG = function (csg) {
  let sides = csg.polygons.map(function (p) {
    return Side._fromFakePolygon(p)
  })
  .filter(function (s) {
    return s !== null
  })
  return fromSides(sides)
}

module.exports = fromFakeCSG
