const subtract = function (ohterCag, cag) {
  let cags
  if (cag instanceof Array) {
    cags = cag
  } else {
    cags = [cag]
  }
  let result = toCSGWall(ohterCag, -1, 1)
  cags.map(function (cag) {
    result = subtractSub(result, toCSGWall(cag, -1, 1), false, false)
  })
  result = retesselate(result)
  result = canonicalize(result)
  result = fromFakeCSG(result)
  result = canonicalize(result)
  return result
}