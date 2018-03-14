const {isCSG} = require('../../core/utils')
const {expandedShellOfCAG, expandedShellOfCCSG} = require('./expandedShell')

const expand = function (shape, radius, resolution) {
  let result
  if (isCSG(shape)) {
    result = shape.union(expandedShellOfCCSG(shape, radius, resolution))
    result = result.reTesselated()
    result.properties = shape.properties // keep original properties
  } else {
    result = shape.union(expandedShellOfCAG(shape, radius, resolution))
  }
  return result
}
// FIXME: conflict between API & internal
/** expand an object in 2D/3D space
 * @param {float} radius - the radius to expand by
 * @param {Object} object a CSG/CAG objects to expand
 * @returns {CSG/CAG} new CSG/CAG object , expanded
 *
 * @example
 * let expanededShape = expand([0.2,15,1], sphere())
 */
function _expand (radius, n, object) {
  return expand(object, radius, n)
}

module.exports = expand
