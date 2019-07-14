// Calculate the intersect point of the two line segments (p1-p2 and p3-p4), end points included.
// @see http://paulbourke.net/geometry/pointlineplane/
// Note: If the line segments do NOT intersect then undefined is returned
// Return the intersection point of two line segments
const intersect = (p1, p2, p3, p4) => {
  // Check if none of the lines are of length 0
  if ((p1[0] === p2[0] && p1[1] === p2[1]) || (p3[0] === p4[0] && p3[1] === p4[1])) {
    return undefined
  }

  denominator = ((p4[1] - p3[1]) * (p2[0] - p1[0]) - (p4[0] - p3[0]) * (p2[1] - p1[1]))

  // Lines are parallel
  if (Math.abs(denominator) < Number.MIN_VALUE) {
    return undefined
  }

  let ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) - (p4[1] - p3[1]) * (p1[0] - p3[0])) / denominator
  let ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) - (p2[1] - p1[1]) * (p1[0] - p3[0])) / denominator

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return undefined
  }

  // Return the x and y coordinates of the intersection
  let x = p1[0] + ua * (p2[0] - p1[0])
  let y = p1[1] + ua * (p2[1] - p1[1])

  return [x, y]
}

module.exports = intersect
