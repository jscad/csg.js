const {defaultResolution2D} = require('../../core/constants')

const flatten = require('../../utils/flatten')

const {vec2} = require('../../math')

const {geom2, geom3, path2} = require('../../geometry')

const {offsetFromGeom2, offsetFromPoints} = require('./offset')
const area = require('./area')
const expandShell = require('./expandShell')
const union = require('../booleans/union')

/*
 * Expand the given geometry (path2) into 2D geometry (geom2).
 * @param {Number} [options.delta=1] - delta (+) of expansion
 * @param {Integer} [options.segments=0] - number of segments when creating rounded corners, or zero for chamfer
 * @returns {geom2} new geometry
 */
const expandPath2 = (options, geometry) => {
  const defaults = {
    delta: 1,
    segments: 0,
  }
  let {delta, segments} = Object.assign({}, defaults, options)

  if (delta <= 0) throw new Error('paths are infinity thin, and cannot contract')

  let points = path2.toPoints(geometry)
  let offsetopts = {delta: delta, segments: segments, closed: geometry.isClosed}
  let external = offsetFromPoints(offsetopts, points)

  offsetopts = {delta: -delta, segments: segments, closed: geometry.isClosed}
  let internal = offsetFromPoints(offsetopts, points)

  let newgeometry = null
  if (geometry.isClosed) {
    // NOTE: creating path2 from the points insures proper closure
    let epath = path2.fromPoints({closed: true}, external)
    let ipath = path2.fromPoints({closed: true}, internal.reverse())
    let esides = geom2.toSides(geom2.fromPoints(path2.toPoints(epath)))
    let isides = geom2.toSides(geom2.fromPoints(path2.toPoints(ipath)))
    newgeometry = geom2.create(esides.concat(isides))
  } else {
    let capsegments = Math.floor(segments / 2) // rotation is 180 degrees
    let e2iCap = []
    let i2eCap = []
    if (capsegments > 0) {
      let orientation = area(points)
      let rotation = orientation < 0 ? -Math.PI : Math.PI
      let step = rotation / capsegments
      let eCorner = points[points.length - 1]
      let e2iStart = vec2.angle(vec2.subtract(external[external.length - 1], eCorner))
      let iCorner = points[0]
      let i2eStart = vec2.angle(vec2.subtract(internal[0], iCorner))
      for (let i = 1; i < capsegments; i++) {
        let radians = e2iStart + (step * i)
        let point = vec2.add(eCorner, vec2.scale(delta, vec2.fromAngleRadians(radians)))
        e2iCap.push(point)
  
        radians = i2eStart + (step * i)
        point = vec2.add(iCorner, vec2.scale(delta, vec2.fromAngleRadians(radians)))
        i2eCap.push(point)
      }
    }
    let allpoints = external.concat(e2iCap, internal.reverse(), i2eCap)
    newgeometry = geom2.fromPoints(allpoints)
  }
  return newgeometry
}

/*
 * Expand the given geometry.
 * @param {Number} [options.delta=1] - delta (+/-) of expansion
 * @param {Integer} [options.segments=0] - number of segments when creating rounded corners, or zero for chamfer
 * @returns {geom2} new geometry
 */
const expandGeom2 = (options, geometry) => {
  return offsetFromGeom2(options, geometry)
}

/*
 * Expand the given geometry.
 * @param {Number} [options.delta=1] - delta (+/-) of expansion
 * @param {Integer} [options.segments=defaultResolution3D] - number of segments when creating rounded corners
 * @returns {geom2} new geometry
 */
const expandGeom3 = (options, geometry) => {
  let expanded = expandShell(options, geometry)
  return union(geometry, expanded)
}

/**
 * Expand the given object(s) using the given options (if any)
 * @param {Object} options - options for expand
 * @param {Number} options.delta=1 - delta (+/-) of expansion
 * @param {Integer} [options.segments] - number of segments when creating rounded corners, or zero for chamfer
 * @param {Object|Array} objects - the objects(s) to expand
 * @return {Object|Array} the expanded object(s)
 *
 * @example
 * let newsphere = expand({delta: 2}, cube({center: [0,0,15], size: [20, 25, 5]}))
 */
const expand = function (options, ...objects) {
  objects = flatten(objects)
  if (objects.length === 0) throw new Error('wrong number of arguments')

  const results = objects.map(function (object) {
    if (path2.isA(object)) return expandPath2(options, object)
    if (geom2.isA(object)) return expandGeom2(options, object)
    if (geom3.isA(object)) return expandGeom3(options, object)
    return object
  })
  return results.length === 1 ? results[0] : results
}

module.exports = expand
