const vec3 = require('../vec3')

const fromData = require('./fromData')

/**
 * Create a new line in the opposite direction as the given.
 *
 * @param {line3} [out] - receiving line
 * @param {line3} line the 3D line to reverse
 * @returns {line3} a new unbounded 3D line
 */
const reverse = (line) => {
  let point = vec3.clone(line[0])
  let direction = vec3.negate(line[1])
  return fromData(point, direction)
}

module.exports = reverse
