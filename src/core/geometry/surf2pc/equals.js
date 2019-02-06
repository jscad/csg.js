const canonicalize = require('./canonicalize')
const mat4 = require('../../math/mat4')
const vec2 = require('../../math/vec2')

/**
 * Determine if two surfaces are not unequal.
 * Does not detect all isomorphisms, but can confirm
 *   expectations for tests.
 * @param  {surface} a - the reference surface.
 * @param  {surface} b - the surface to compare.
 * @returns {boolean} true if the surfaces are definitely equal.
 */
const equals = (a, b) => {
  if (a.isFlipped != b.isFlipped) {
    return false
  }
  if (a.basePolygons.length != b.basePolygons.length) {
    return false
  }
  a = canonicalize(a)
  b = canonicalize(b)
  for (let nthPolygon = 0; nthPolygon < a.polygons.length; nthPolygon++) {
    let polygonA = a.polygons[nthPolygon]
    let polygonB = b.polygons[nthPolygon]
    if (polygonA.length != polygonB.length) {
      return false
    }
    // TODO: Put rotated list equality in a util somewhere.
    const length = polygonA.length
    let offset = 0
    let unequal;
    do {
      unequal = false
      for (let nthPoint = 0; nthPoint < length; nthPoint++) {
        if (!vec2.equals(polygonA[nthPoint], polygonB[(nthPoint + offset) % length])) {
          unequal = true
          break
        }
      }
      if (!unequal) {
        break
      }
    } while (++offset < length)
    if (unequal) {
      return false
    }
  }
  return true
}

module.exports = equals
