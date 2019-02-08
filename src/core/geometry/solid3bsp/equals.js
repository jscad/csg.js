const canonicalize = require('./canonicalize')

// Checks that a and b are not definitely unequal.
// Only used in tests.
const equals = (a, b) => {
  if (a.basePolygons.length != b.basePolygons.length) {
    return false
  }
  a = canonicalize(a)
  b = canonicalize(b)
  // TODO: This is good enough for tests, but should be replaced.
  if (JSON.stringify(a) != JSON.stringify(b)) {
    return false
  }
  return true
}

module.exports = equals
