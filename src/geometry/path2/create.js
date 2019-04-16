const mat4 = require('../../math/mat4')

/**
 * Produces an empty, open path.
 * @returns {path} a new empty, open path
 * @example
 * let newpath = create()
 */
const create = () => {
  return {
    points: [],
    isClosed: false,
    isCanonicalized: false,
    transforms: mat4.identity()
  }
}

module.exports = create
