const flatten = require('../../utils/flatten')

const {geom3} = require('../../geometry')

const retessellate = require('./retessellate')
const subtractSub = require('./subtractGeom3Sub')

/**
 * Return a new 3D geometry representing space in this geometry but not in the given geometries.
 * Neither this geometry nor the given geometries are modified.
 * @param {...geom3} geometries - list of geometries
 * @returns {geom3} new 3D geometry
 */
const subtract = (...geometries) => {
  geometries = flatten(geometries)

  let newgeometry = geometries.shift()
  geometries.forEach((geometry) => {
    newgeometry = subtractSub(newgeometry, geometry)
  })

  newgeometry.isCanonicalized = true // FIXME hack hack hack
  let newgeomerty = retessellate(newgeometry)
  return newgeometry
}

module.exports = subtract
