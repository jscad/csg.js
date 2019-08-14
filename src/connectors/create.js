const vec3 = require('../math/vec3')

/**
 * FIXME remove this and add to user guide
 * For example a servo motor and a servo horn:
 * Both can have a Connector called 'shaft'
 * The horn can be moved and rotated such that the two connectors match
 * and the horn is attached to the servo motor at the proper position.
 * Connectors are children of the solid, transform wise (parent => child relationship)
 * so they get the same transformations applied as the solid
 */

/**
 * Create a new connector.
 * A connector allows two objects to be connected at predefined positions.
 * @property {vec3} point - the position of the connector (relative to its parent)
 * @property {vec3} axis - the direction (unit vector) of the connector
 * @property {vec3} normal - the direction (unit vector) perpendicular to axis, that defines the "12 o'clock" orientation of the connector
 * @example
 * let myconnector = create()
 */
const create = () => {
  return {
    point: vec3.create(),
    axis: vec3.unit([0, 0, 1]),
    normal: vec3.unit([1, 0, 0])
  }
}

module.exports = create
