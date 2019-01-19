const vec3 = require('../math/vec3')
const fromPointAxisNormal = require('./fromPointAxisNormal')

/** Creates a new Connector, with the connection point moved in the direction of the axis
 * @returns {Connector} a normalized connector
 */
const extend = (distance, connector) => {
  const newpoint = vec3.add(connector.point, vec3.scale(distance, vec3.unit(connector.axis)))
  return fromPointAxisNormal(newpoint, connector.axis, connector.normal)
}

module.exports = extend