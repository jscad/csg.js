const mat4 = require('../../math/mat4')

/**
 * Produces an empty, open path.
 * @returns {path2} - the empty, open path.
 * @example
 * create()
 */
const create = () => {
  return {
    points: [],
    isClosed: false,
    isCanonicalized: true, // Has no non-canonical points.
  }
}

module.exports = create
