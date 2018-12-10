const vec2 = require('./vec2')

/**
 * Creates new line2 in opposite direction as the given
 *
 * @param {line2} line the line to reverse
 * @returns {line2} a new 2D line
 */
const reverse = (line) => {
  let normal = vec2.negated(line)
  let distance = -line[3]
  return fromValues(normal[0], normal[1], distance)
}

module.exports = equals
