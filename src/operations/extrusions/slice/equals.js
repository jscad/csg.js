const vec3 = require('../../../math/vec3')

const toEdges = require('./toEdges')

/**
  * Determine if the given slices are equal.
  * @param {slice} a - the first slice to compare
  * @param {slice} b - the second slice to compare
  * @returns {boolean}
  */
const equals = (a, b) => {
  let aedges = toEdges(a)
  let bedges = toEdges(b)

  if (aedges.length !== bedges.length) {
    return false
  }

  let isEqual = aedges.reduce((acc, aedge, i) => {
    let bedge = bedges[i]
    let d = vec3.squaredDistance(aedge[0], bedge[0])
    return acc && (d < Number.EPSILON)
  }, true)

  return isEqual
}

module.exports = equals
