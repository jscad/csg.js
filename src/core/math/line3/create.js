const vec3 = require('./vec3')

/**
 * Create a simple line in 3D space, centered at 0,0,0 and lying on X axis.
 */
const create = () => {
  let point = vec3.fromValues(0, 0, 0)
  let direction = vec3.fromValues(0, 0, 1)
  return fromData(point, direction)
}

module.exports = create
