const poly3 = require('../../poly3')
const clone = sourceGeometry => {
  return {
    polygons: sourceGeometry.polygons.map(p => poly3.clone(p)),
    isCanonicalized: sourceGeometry.isCanonicalized,
    isRetesselated: sourceGeometry.isRetesselated
  }
}

module.exports = clone
