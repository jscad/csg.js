const vec3 = require('../math/vec3')

/** Create a Connector
 * A connector allows to attach two objects at predefined positions
 * For example a servo motor and a servo horn:
 * Both can have a Connector called 'shaft'
 * The horn can be moved and rotated such that the two connectors match
 * and the horn is attached to the servo motor at the proper position.
 * Connectors are stored in the properties of a solid so they
 * get the same transformations applied as the solid

 * @returns {Connector} a new connector
 */
const create = () => {
  return {
    point: vec3.create(),
    axis: vec3.unit(vec3.create()),
    normal: vec3.unit(vec3.create())
  }
}

module.exports = create
