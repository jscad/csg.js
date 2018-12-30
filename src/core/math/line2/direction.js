const vec2 = require('../vec2')

/**
 * Return the direction of the given line.
 *
 * @return {vec2} a new vector in the direction of the line
 */
const direction = (line) => {
  const direction = vec2.normal(line)
  vec2.negate(direction, direction)
  return direction
}

module.exports = direction
