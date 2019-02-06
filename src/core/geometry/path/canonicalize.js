const vec3 = require('../../math/vec3')

/**
 * Produces a canonicalized path by canonicalizing the contains points as
 *   necessary. Must be called before exposing any point data.
 * @param {path} path - the path to canonicalize.
 * @returns {path}
 * @example
 * canonicalize(path)
 */
const canonicalize = (path) => {
  if (path.isCanonicalized) {
    return path
  }
  // Canonicalize path in-place.
  path.points = path.points.map(vec3.canonicalize)
  path.isCanonicalized = true
  return path
}

module.exports = canonicalize
