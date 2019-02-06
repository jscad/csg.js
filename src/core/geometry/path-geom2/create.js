const mat4 = require('../../math/mat4')

/** Creates a new empty surface
  * This geometry does in-place canonicalization.
  * @returns {surface} a new empty surface
  */
const create = () => {
  return {
    basePolygons: [], // The untransformed, canonicalized geometry.
    polygons: [], // The transformed geometry when canonical.
    transforms: mat4.identity(),
    isCanonicalized: true, // Has no non-canonical elements.
    isFlipped: false // Flipped surfaces are wound backward
  }
}

module.exports = create
