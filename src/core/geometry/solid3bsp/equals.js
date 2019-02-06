const canonicalize = require('./canonicalize')

// Checks that a and b are not definitely unequal.
const equals = (a, b) => {
  console.log(`QQ/equals/a: ${JSON.stringify(a)}`)
  console.log(`QQ/equals/b: ${JSON.stringify(b)}`)
  if (a.basePolygons.length != b.basePolygons.length) {
    console.log(`QQ/equals/1`)
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
