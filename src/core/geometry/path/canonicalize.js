const vec2 = require('../../math/vec2')

/**
 * Produces a canonicalized path by canonicalizing the contains points as
 *   necessary. Must be called before exposing any point data.
 * @param {path2} path - the path to canonicalize.
 * @returns {path2}
 * @example
 * canonicalize(path)
 */
const canonicalize = (path) => {
  if (path.isCanonicalized) {
    return path
  }
  // Canonicalize path in-place.
  path.points = path.points.map(vec2.canonicalize)
  path.isCanonicalized = true
  return path
}

module.exports = canonicalize
