const vec2 = require('../../math/vec2')

/** Determine if two geometries are not unequal.
  * For closed paths this includes equality under point order rotation.
  * e.g., [[1, 2], [3, 4]] and [[3, 4], [1, 2]] are equal for closed paths.
  * @param {path2} a - the first path to compare.
  * @param {path2} b - the second path to compare.
  * @returns {boolean}
  */
const equals = (a, b) => {
  if (a.closed != b.closed) {
    return false;
  }
  if (a.points.length != b.points.length) {
    return false
  }
  let length = a.points.length;
  let offset = 0;
  do {
    let unequal = false;
    for (let i = 0; i < length; i++) {
      if (!vec2.equals(a.points[i], b.points[(i + offset) % length])) {
        unequal = true;
        break;
      }
    }
    if (unequal == false) {
      return true;
    }
    if (!a.closed) {
      return false;
    }
    // Circular paths might be equal under graph rotation.
    // Try effectively rotating b one step.
  } while (++offset < length);
  return false;
}

module.exports = equals
