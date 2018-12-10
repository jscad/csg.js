const vec2 = require('./vec2')

"../../utils/various"

const intersect = (line1, line2) => {
  let point = solve2Linear(line1[0], line1[1], line2d[0], line2d[1], line1[2], line2d[2])
  return vec2.clone(point)
}

module.exports = intersect
