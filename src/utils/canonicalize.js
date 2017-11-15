const FuzzyCSGFactory = require('./FuzzyFactory3d')

/**
   * Returns a cannoicalized version of the input csg : ie every very close
   * points get deduplicated
   * @returns {CSG}
   * @example
   * let rawCSG = someCSGMakingFunction()
   * let canonicalizedCSG = canonicalize(rawCSG)
   */
const canonicalize = function (csg, options) {
  if (csg.isCanonicalized) {
    return csg
  } else {
    const factory = new FuzzyCSGFactory()
    let result = CSGFromCSGFuzzyFactory(factory, csg)
    result.isCanonicalized = true
    result.isRetesselated = csg.isRetesselated
    result.properties = csg.properties // keep original properties
    return result
  }
}

module.exports = canonicalize
