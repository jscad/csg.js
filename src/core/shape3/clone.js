const geom3 = require('../geometry/geom3')
const mat4 = require('../math/mat4')
const create = require('./create')

/** create a copy/clone of the input shape
 * @param  {Shape3} sourceShape the shape to clone
 * @returns {Shape3} the new clone
 */
const clone = sourceShape => {
  const newShape = create()
  newShape.geometry = sourceShape.geometry // geom3.clone(sourceShape.geometry)
  mat4.clone(newShape.transforms, sourceShape.transforms)
  // TODO newShape.properties = sourceShape.properties
  return newShape
}

module.exports = clone
