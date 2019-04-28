const flatten = require('../utils/flatten')

const {geom3} = require('../../geometry')

const retessellate = require('./retessellate')
const intersectSub = require('./intersectGeom3Sub')

/**
 * Return a new 3D geometry representing space in both the first geometry and
 * in the subsequent geometries. None of the given geometries are modified.
 * @param {...geom3} geometries - list of 3D geometries
 * @returns {geom3} new 3D geometry
 */
const intersect = (...geometries) => {
  geometries = flatten(geometries)

  let newgeometry = geometries.shift()
  geometries.forEach((geometry) => {
    newgeometry = intersectSub(newgeometry, geometry)
  })

  newgeometry.isCanonicalized = true // FIXME hack hack hack
  let newgeomerty = retessellate(newgeometry)
  return newgeometry
}

module.exports = intersect
