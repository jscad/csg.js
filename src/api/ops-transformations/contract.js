const {isCSG} = require('../../core/utils')
const {expandedShellOfCAG, expandedShellOfCCSG} = require('./expandedShell')

const contract = function (shape, radius, resolution) {
  let result
  if (isCSG(shape)) {
    result = shape.subtract(expandedShellOfCCSG(shape, radius, resolution))
    result = result.reTesselated()
    result.properties = shape.properties // keep original properties
  } else {
    result = shape.subtract(expandedShellOfCAG(shape, radius, resolution))
  }
  return result
}

// FIXME: conflict between API & internal
/** contract an object(s) in 2D/3D space
 * @param {float} radius - the radius to contract by
 * @param {Object} object a CSG/CAG objects to contract
 * @returns {CSG/CAG} new CSG/CAG object , contracted
 *
 * @example
 * let contractedShape = contract([0.2,15,1], sphere())
 */
function _contract (radius, n, object) {
  return contract(object, radius, n)
}

module.exports = contract
