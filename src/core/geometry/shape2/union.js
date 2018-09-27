// FIXME: double check this algorithm
const union = function (solids) {
  let cags = solids
  let i
  cags[0] = retesselate(toCSGWall(cags[0], -1, 1))
  // combine csg pairs in a way that forms a balanced binary tree pattern
  for (i = 1; i < cags.length; i += 2) {
    const current = retesselate(toCSGWall(cags[i], -1, 1))
    const previous = cags[i - 1]
    cags.push(unionSub(previous, current, false, false))
  }
  return canonicalize(fromFakeCSG(cags[i - 1]))
}
