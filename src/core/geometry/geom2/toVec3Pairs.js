const toVec3Pairs = (geometry, m) => {
  // transform m
  let pairs = geometry.sides.map( side => {
    let p0 = side.vertex0.pos
    let p1 = side.vertex1.pos
    return [Vector3D.Create(p0.x, p0.y, 0),
      Vector3D.Create(p1.x, p1.y, 0)]
  })
  if (typeof m !== 'undefined') {
    pairs = pairs.map( pair => {
      return pair.map( v => {
        return v.transform(m)
      })
    })
  }
  return pairs
}

module.exports = toVec3Pairs
