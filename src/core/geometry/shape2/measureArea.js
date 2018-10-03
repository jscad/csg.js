const vec2 = require('../../math/vec2')

// see http://local.wasp.uwa.edu.au/~pbourke/geometry/polyarea/ :
// Area of the polygon. For a counter clockwise rotating polygon the area is positive, otherwise negative
// Note(bebbi): this looks wrong. See polygon getArea()
const area = shape => {
  let polygonArea = shape.sides
    .reduce((area, side) => area + vec2.cross(side[0], side[1]), 0)
  polygonArea *= 0.5
  return polygonArea
}

module.exports = area
