const { vec2 } = require('../../math')

const { geom2, path2 } = require('../../geometry')

const offsetFromPoints = require('./offsetFromPoints')

const area = require('./area')

/**
 * Expand the given geometry (path2) using the given options (if any).
 * @param {Object} options - options for expand
 * @param {Number} [options.delta=1] - delta (+) of expansion
 * @param {Integer} [options.segments=0] - number of segments when creating rounded corners, or zero for chamfer
 * @param {path2} geometry - the geometry to expand
 * @returns {geom2} expanded geometry
 */
const expandPath2 = (options, geometry) => {
  const defaults = {
    delta: 1,
    segments: 0
  }
  let { delta, segments } = Object.assign({ }, defaults, options)

  if (delta <= 0) throw new Error('the given delta must be positive')

  let points = path2.toPoints(geometry)
  if (points.length === 0) throw new Error('the given geometry cannot be empty')

  let offsetopts = { delta: delta, segments: segments, closed: geometry.isClosed }
  let external = offsetFromPoints(offsetopts, points)

  offsetopts = { delta: -delta, segments: segments, closed: geometry.isClosed }
  let internal = offsetFromPoints(offsetopts, points)

  let newgeometry = null
  if (geometry.isClosed) {
    // NOTE: creating path2 from the points insures proper closure
    let epath = path2.fromPoints({ closed: true }, external)
    let ipath = path2.fromPoints({ closed: true }, internal.reverse())
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

module.exports = expandPath2
