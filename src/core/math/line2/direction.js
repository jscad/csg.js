const vec2 = require('./vec2')

/**
 * Return the direction of the given line
 *
 * @return {vec2} direction of the line
 */
const direction = (line) => {
  return vec2.normal(line)
}

module.exports = direction
