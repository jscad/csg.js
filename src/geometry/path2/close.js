const {EPS} = require('../../core/constants')

const vec2 = require('../../math/vec2')

const clone = require('./clone')

/**
 * Close the given geometry.
 * @params {geometry} the path to close
 * @returns {path} the closed path
 */
const close = (geometry) => {
  if (geometry.isClosed) return geometry

  const cloned = clone(geometry)
  cloned.points = undefined
  cloned.isCanonicalized = false
  cloned.isClosed = true
 
  if (cloned.basePoints.length > 1) {
    // make sure the paths are formed properly
    let basePoints = cloned.basePoints
    let p0 = basePoints[0]
    let pn = basePoints[basePoints.length - 1]
    while (vec2.distance(p0, pn) < (EPS*EPS)) {
      basePoints.pop()
      if (basePoints.length === 1) break
      pn = basePoints[basePoints.length - 1]
    }
  }
  return cloned
}

module.exports = close
