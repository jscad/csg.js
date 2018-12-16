
/**
 * Create a line in 3D space from the given data.
 *
 * and point is a random point on the line
 * where direction must be a unit vector
 */
const fromData = (point, direction) => {
  let unit = vec3.unit(direction)
  return [point, unit]
}

module.exports = fromData
