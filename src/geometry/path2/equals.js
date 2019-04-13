const canonicalize = require('./canonicalize')
const vec2 = require('../../math/vec2')

/**
  * Determine if the given paths are equal.
  * For closed paths this includes equality under point order rotation.
  * @param {path} a - the first path to compare
  * @param {path} b - the second path to compare
  * @returns {boolean}
  */
const equals = (a, b) => {
  if (a.isClosed !== b.isClosed) {
    return false
  }
  if (a.basePoints.length !== b.basePoints.length) {
    return false
  }
  a = canonicalize(a)
  b = canonicalize(b)
  let length = a.points.length
  let offset = 0
  do {
    let unequal = false
    for (let i = 0; i < length; i++) {
      if (!vec2.equals(a.points[i], b.points[(i + offset) % length])) {
        unequal = true
        break
      }
    }
    if (unequal === false) {
      return true
    }
    if (!a.isClosed) {
      return false
    }
    // Circular paths might be equal under graph rotation.
    // Try effectively rotating b one step.
  } while (++offset < length)
  return false
}

module.exports = equals
