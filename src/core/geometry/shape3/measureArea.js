const area = function (csg) {
  let result = csg.toTriangles().map(function (triPoly) {
    return triPoly.getTetraFeatures(['area'])
  })
  console.log('area', result)
}

module.exports = area
