const canonicalize = require('./canonicalize')

// Checks that a and b are not definitely unequal.
// Only used in tests.
const equals = (a, b) => {
  if (a.basePolygons.length != b.basePolygons.length) {
    return false
  }
  a = canonicalize(a)
  b = canonicalize(b)
  if (JSON.stringify(a) != JSON.stringify(b)) {
    console.log(`QQ/equals/2`)
    return false
  }
  console.log(`QQ/equals/3`)
  return true
}

module.exports = equals
