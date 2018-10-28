/**
 * Compare two paths for equality
 * @param (vec} path1 - path2 (array) of types
 * @param (vec} path2 - path2 (array) of types
 * @returns {boolean} result of comparison
 */
const comparePaths = (path1, path2) => {
  if (path1.length === path2.length) {
    return path1.reduce((valid, value, index) => {
      // special comparison for NAN values
        if (isNaN(path1[index]) && isNaN(path2[index])) {
          return valid
        }
      // only compare values, not types
        let diff = Math.abs(path1[index] - path2[index])
        return valid && (diff < Number.EPSILON)
      }, true)
  }
  return false
}

module.exports = comparePaths
