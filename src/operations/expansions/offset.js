const { EPS } = require('../../core/constants')

const flatten = require('../../utils/flatten')

const intersect = require('../../math/utils/intersect')

const {line2, vec2} = require('../../math')

const {geom2, geom3, path2} = require('../../geometry')

const {arePointsInside} = require('./inside')
const area = require('./area')

/*
 * Create a set of offset points from the given points.
 * @param {Object} [options] - options for offset
 * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)
 * @param {Integer} [options.segments=0] - segments of rounded ends, or zero for chamfer
 * @param {Array} points - array of 2D points
 * @returns {Array} new set of offset points, plus points for each rounded corner
 */
const offsetFromPoints = (options, points) => {
  const defaults = {
    delta: 1,
    closed: false,
    segments: 0,
  }
  let {delta, closed, segments} = Object.assign({}, defaults, options)

  if (Math.abs(delta) < EPS) return points

  let rotation = area(points) // + counter clockwise, - clockwise
  if (rotation === 0) rotation = 1.0

  // use right hand normal?
  let orientation = ((rotation > 0) && (delta >= 0)) || ((rotation < 0) && (delta < 0))
  delta = Math.abs(delta) // sign is no longer required

  let prevsegment = null
  const newpoints = []
  const corners = []
  let n =  points.length
  for (let i = 0; i < n; i++) {
    let j = (i + 1) % n
    let p0 = points[i]
    let p1 = points[j]
    // calculate the unit normal
    let of = orientation ? vec2.normal(vec2.subtract(p0, p1)) : vec2.normal(vec2.subtract(p1, p0))
    vec2.normalize(of, of)
    // calculate the offset vector
    vec2.scale(of, delta, of)
    // calculate the new points (edge)
    let n0 = vec2.add(p0, of)
    let n1 = vec2.add(p1, of)

    let cursegment = [n0, n1]
    if (prevsegment != null) {
      if (closed || (!closed && j != 0)) {
        // check for intersection of new line segments
        let ip = intersect(prevsegment[0], prevsegment[1], cursegment[0], cursegment[1])
        if (ip) {
          // adjust the previous points
          newpoints.pop()
          // adjust current points
          cursegment[0] = ip
        } else {
          corners.push({c: p0, s0: prevsegment, s1: cursegment})
        }
      }
    }
    prevsegment = [n0, n1]

    if (j === 0 && !closed) continue

    newpoints.push(cursegment[0])
    newpoints.push(cursegment[1])
  }
  // complete the closure if required
  if (closed && prevsegment != null) {
    // check for intersection of closing line segments
    let n0 = newpoints[0]
    let n1 = newpoints[1]
    let ip = intersect(prevsegment[0], prevsegment[1], n0, n1)
    if (ip) {
      // adjust the previous points
      newpoints[0] = ip
      newpoints.pop()
      newpoints.push(ip)
    } else {
      let p0 = points[0]
      let cursegment = [n0, n1]
      corners.push({c: p0, s0: prevsegment, s1: cursegment})
    }
  }

  // add corners
  if (segments > 0) {
    let cornersegments = Math.floor(segments / 4)
    if (cornersegments === 0) {
      // create pointed corners
      corners.forEach((corner) => {
        let line0 = line2.fromPoints(corner.s0[0], corner.s0[1])
        let line1 = line2.fromPoints(corner.s1[0], corner.s1[1])
        let ip = line2.intersectPointOfLines(line0, line1)
        let p0 = corner.s0[1]
        let i = newpoints.findIndex((point) => vec2.equals(p0, point))
        i = (i + 1) % newpoints.length
        newpoints.splice(i, 0, ip)
      })
    }
    if (cornersegments > 1) {
      // create rounded corners
      corners.forEach((corner) => {
        // calculate angle of rotation
        let rotation = vec2.angle(vec2.subtract(corner.s1[0], corner.c))
        rotation -= vec2.angle(vec2.subtract(corner.s0[1], corner.c))
        if (orientation && rotation < 0) {
          rotation = rotation + Math.PI
          if (rotation < 0) rotation = rotation + Math.PI
        }
        if ((!orientation) && rotation > 0) {
          rotation = rotation - Math.PI
          if (rotation > 0) rotation = rotation - Math.PI
        }

        // generate the segments
        cornersegments = Math.floor(segments * (Math.abs(rotation) / (2 * Math.PI)))
        let step = rotation / cornersegments
        let start = vec2.angle(vec2.subtract(corner.s0[1], corner.c))
        let cornerpoints = []
        for (let i = 1; i < cornersegments; i++) {
          let radians = start + (step * i)
          let point = vec2.add(corner.c, vec2.scale(delta, vec2.fromAngleRadians(radians)))
          cornerpoints.push(point)
        }
        if (cornerpoints.length > 0) {
          let p0 = corner.s0[1]
          let i = newpoints.findIndex((point) => vec2.equals(p0, point))
          i = (i + 1) % newpoints.length
          newpoints.splice(i, 0, ...cornerpoints)
        }
      })
    }
  }
  return newpoints
}

/*
 * Create a offset path from the given path.
 * @param {Object} [options] - options for offset
 * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)
 * @param {Integer} [options.segments=0] - segments of rounded ends, or zero for chamfer
 * @param {path2} geometry - geometry from which to create the offset
 * @returns {path2} new geometry, plus rounded corners
 */
const offsetFromPath2 = (options, geometry) => {
  const defaults = {
    delta: 1,
    closed: geometry.isClosed,
    segments: 0,
  }
  let {delta, closed, segments} = Object.assign({}, defaults, options)

  options = {
    delta: delta,
    closed: closed,
    segments: segments
  }
  let newpoints = offsetFromPoints(options, path2.toPoints(geometry))
  return path2.fromPoints({closed: closed}, newpoints)
}

/*
 * Create a offset geometry from the given geometry.
 * @param {Object} [options] - options for offset
 * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)
 * @param {Integer} [options.segments=0] - segments of rounded ends, or zero for chamfer
 * @param {geom2} geometry - geometry from which to create the offset
 * @returns {geom2} new geometry, plus rounded corners
 */
const offsetFromGeom2 = (options, geometry) => {
  const defaults = {
    delta: 1,
    segments: 0,
  }
  let {delta, segments} = Object.assign({}, defaults, options)

  // convert the geometry to outlines, and generate offsets from each
  let outlines = geom2.toOutlines(geometry)
  let newoutlines = outlines.map((outline) => {
    let level = outlines.reduce((acc, polygon) => {
      return acc + arePointsInside(outline, polygon)
    }, 0)
    let outside = (level % 2) == 0

    options = {
      delta: outside ? delta : -delta,
      closed: true,
      segments: segments
    }
    return offsetFromPoints(options, outline)
  })

  // create a composite geometry from the new outlines
  let allsides = newoutlines.reduce((sides, newoutline) => {
    return sides.concat(geom2.toSides(geom2.fromPoints(newoutline)))
  }, [])
  return geom2.create(allsides)
}

/*
 * Create offset geometry(s) from the given object(s).
 * @param {Object} options - options for offset
 * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)
 * @param {Integer} [options.segments=0] - segments of rounded ends, or zero for chamfer
 * @param {Object|Array} objects - object(s) to offset
 * @return {Object|Array} the offset geometry(s)
 */
const offset = (options, ...objects) => {
  objects = flatten(objects)
  if (objects.length === 0) throw new Error('wrong number of arguments')

  const results = objects.map((object) => {
    if (path2.isA(object)) return offsetFromPath2(options, object)
    if (geom2.isA(object)) return offsetFromGeom2(options, object)
    //if (geom3.isA(object)) return geom3.transform(matrix, object)
    return object
  })
  return results.length === 1 ? results[0] : results
}

module.exports = {
  offset,
  offsetFromPath2,
  offsetFromGeom2,
  offsetFromPoints
}
