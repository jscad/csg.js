const vec3 = require('../../math/vec3')
const measureBoundingBox = require('./measureBoundingBox')

/** compute's a poly3's bounding sphere
 * returns an array with a midpoint (vec3) and a radius
 * @param {poly3} the poly3 to measure
 * @returns the computed bounding sphere
 */
const measureBoundingSphere = poly3 => {
  const box = measureBoundingBox(poly3)
  const midpoint = vec3.add(box[0], vec3.scale(0.5, box[1]))
  let radius = vec3.distance(midpoint, box[1])
  return [midpoint, radius]
}

module.exports = measureBoundingSphere
