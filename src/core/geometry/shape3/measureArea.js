const poly3 = require('../poly3')
const area = function (csg) {
  let result = csg.toTriangles().map(triPoly => poly3.measureArea())
  console.log('area', result)
}

module.exports = area
