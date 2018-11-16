const retesselate = require('./retesselate')
const canonicalize = require('./canonicalize')

const intersection = (otherCag, geometry) => {
  let cags
  if (geometry instanceof Array) {
    cags = geometry
  } else {
    cags = [geometry]
  }
  let r = toShape3Wall(otherCag, -1, 1)
  cags.map(function (geometry) {
    r = intersectSub(r, toShape3Wall(geometry, -1, 1), false, false)
  })
  r = retesselate(r)
  r = canonicalize(r)
  r = fromFakeCSG(r)
  r = canonicalize(r)
  return r
}

module.exports = intersection