
/**
 * Convert a shape2 to a list of points.
 * @param {Shape2} shape the shape to convert
 * @return {points[]} list of points in 2D space
 */
const toPoints = (params, shape) => {
  let points = cag.sides.map(function (side) {
    let v0 = side.vertex0
    // let v1 = side.vertex1
    return v0.pos
  })
  // due to the logic of fromPoints()
  // move the first point to the last
  if (points.length > 0) {
    points.push(points.shift())
  }
  return points
}

const toPointsArray = input => {
  let points
  if ('sides' in input) { // this is a cag
    points = []
    input.sides.forEach(side => {
      points.push([side.vertex0.pos.x, side.vertex0.pos.y])
      points.push([side.vertex1.pos.x, side.vertex1.pos.y])
    })
    // cag.sides.map(side => [side.vertex0.pos.x, side.vertex0.pos.y])
    //, side.vertex1.pos.x, side.vertex1.pos.y])
    // due to the logic of CAG.fromPoints()
    // move the first point to the last
    /* if (points.length > 0) {
      points.push(points.shift())
    } */
  } else if ('points' in input) {
    points = input.points.map(p => ([p.x, p.y]))
  }

  return points
}

module.exports = toPointsArray

module.exports = toPoints
