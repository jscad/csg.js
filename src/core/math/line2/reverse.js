const vec2 = require('../vec2')

const fromValues = require('./fromValues')

/**
 * Create a new line in the opposite direction as the given
 *
 * @param {line2} line the line to reverse
 * @returns {line2} a new unbounded 2D line
 */
const reverse = (line) => {
  let normal = vec2.negate(line)
  let distance = -line[2]
  return fromValues(normal[0], normal[1], distance)
}

module.exports = reverse
