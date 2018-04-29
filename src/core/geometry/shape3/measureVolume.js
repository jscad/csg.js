const volume = function (csg) {
  let result = csg.toTriangles().map(function (triPoly) {
    return triPoly.getTetraFeatures(['volume'])
  })
  console.log('volume', result)
}

module.exports = volume
