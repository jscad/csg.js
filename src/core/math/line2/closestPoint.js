const vec2 = require('../vec2')
const { solve2Linear } = require("../../utils/various")

const direction = require('./direction')
const origin = require('./origin')
const fromPoints = require('./fromPoints')

const closestPoint = (line, point) => {
  // distance to line (closest, 90 degress from line)
  // distance to origin
  // if same then closest is origin
  // else calculate distance of last side
console.log('***** closestPoint')
  line2 = fromPoints(vec2.rotate(Math.PI, point), point)
console.log(vec2.toString(line2))
  let closest = solve2Linear(line[0], line[1], line2[0], line2[1], line[2], line2[2])
  return closest
}

/**
 * FIXME Is this correct?
 */
const b = () => {
  const org = origin(line)
  const dir = direction(line)
  const distance = vec2.dot(point, dir)
  const closest = vec2.add(org, [distance, distance])
  return closest
}

module.exports = closestPoint
