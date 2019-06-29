const flatten = require('../../utils/flatten')

const {geom2, path2} = require('../../geometry')

const {expand} = require('../expansions')

const area = require('../expansions/area')

const extrudeLinear = require('./extrudeLinear')

/*
 * Expand and extrude the given path.
 */
const extrudeFromPath2 = (options, geometry) => {
  const defaults = {
    radius: 1,
    segments: 0
  }
  let {radius, segments} = Object.assign({}, defaults, options)

  options.delta = radius

  const points = path2.toPoints(geometry)
  if (points.length === 0) throw new Error('the given geometry cannot be empty')

  let newgeometry = expand(options, geometry)
  return extrudeLinear(options, newgeometry)
}

/*
 * Expand and extrude the given geom2.
 */
const extrudeFromGeom2 = (options, geometry) => {
  const defaults = {
    radius: 1,
    segments: 0
  }
  let {radius, segments} = Object.assign({}, defaults, options)

  options.delta = radius

  // convert the geometry to outlines
  let outlines = geom2.toOutlines(geometry)
  if (outlines.length === 0) throw new Error('the given geometry cannot be empty')

  // expand the outlines
  let newparts = outlines.map((outline) => {
    if (area(outline) < 0) outline.reverse() // all outlines must wind counter clockwise
    return expand(options, path2.fromPoints({closed: true}, outline))
  })

  // create a composite geometry
  let allsides = newparts.reduce((sides, part) => {
    return sides.concat(geom2.toSides(part))
  }, [])
  let newgeometry = geom2.create(allsides)

  return extrudeLinear(options, newgeometry)
}

/**
 * Extrude the given object(s) by following the outline(s) with a rectangle.
 * @param {Object} options - options for extrusion, if any
 * @param {Number} [options.radius=1] - radius of the rectangle
 * @param {Integer} [options.segments=0] - number of segments for rounded ends, or zero for chamfer
 * @param {Array} [options.offset=[0,0,1]] - direction of the extrusion as a 3D vector
 * @param {Number} [options.twistAngle=0] - final rotation (degrees) about the origin of the shape (if any)
 * @param {Integer} [options.twistSteps=1] - number of twist segments about the axis (if any)
 * @param {Object|Array} objects - the objects(s) to extrude
 * @return {Object|Array} the extruded object(s)
 *
 * @example:
 * let mywalls = extrudeRectangular({offset: [0,0,10]}, square())
 */
const extrudeRectangular = (options, ...objects) => {
  const defaults = {
    radius: 1,
    segments: 0
  }
  let {radius, segments} = Object.assign({}, defaults, options)

  objects = flatten(objects)
  if (objects.length === 0) throw new Error('wrong number of arguments')

  if (radius <= 0) throw new Error('radius must be positive')
  if (segments < 0) throw new Error('segments must be zero or more')

  const results = objects.map((object) => {
    if (path2.isA(object)) return extrudeFromPath2(options, object)
    if (geom2.isA(object)) return extrudeFromGeom2(options, object)
    //if (geom3.isA(object)) return geom3.transform(matrix, object)
    return object
  })
  return results.length === 1 ? results[0] : results
}

module.exports = extrudeRectangular
