const vec2 = require('../vec2')

/**
 * Return the origin of the given line.
 *
 * @return {vec2} origin of the line
 */
const origin = (line) => {
  const origin = vec2.scale(line[2], line)
  return origin
}

module.exports = origin
