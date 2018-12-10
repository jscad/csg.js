const vec2 = require('./vec2')

/**
 * Return the origin of the given line
 *
 * @return {vec2} origin of the line
 */
const origin = (line) => {
  return vec2.times(line, line[2])
}

module.exports = origin
