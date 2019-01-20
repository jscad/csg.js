const toVec3Pairs = (geom2, m) => {
  // transform m
  let pairs = geom2.sides.map(function (side) {
    let p0 = side.vertex0.pos
    let p1 = side.vertex1.pos
    return [Vector3D.Create(p0.x, p0.y, 0),
      Vector3D.Create(p1.x, p1.y, 0)]
  })
  if (typeof m !== 'undefined') {
    pairs = pairs.map(function (pair) {
      return pair.map(function (v) {
        return v.transform(m)
      })
    })
  }
  return pairs
}

module.exports = toVec3Pairs
