const {defaultResolution3D, EPS} = require('../../core/constants')

const mat4 = require('../../math/mat4')

const {geom2, geom3, poly3} = require('../../geometry')

const {degToRad} = require('../../math/utils')

const to3DPolygons = require('./to3DPolygons')

/**
 * Rotate extrusion the given geometry using the given options.
 * @param {Object} [options] - options for extrusion
 * @param {Float} [options.angle=360] - angle of the extrusion, in degrees
 * @param {Float} [options.startAngle=0] - start angle of the extrusion, in degrees
 * @param {Float} [options.overflow='cap'] - what to do with points outside of bounds (+ / - x) :
 * defaults to capping those points to 0 (only supported behaviour for now)
 * @param {Integer} [options.resolution=defaultResolution3D] - resolution/number of segments of the extrusion
 * @param {geom2} geometry the 2D geometry to extrude
 * @returns {geom3} new extruded 3D geometry
 */
const extrudeRotate = (options, geometry) => {
  const defaults = {
    resolution: defaultResolution3D,
    startAngle: 0,
    angle: 360,
    overflow: 'cap'
  }
  let {resolution, startAngle, angle, overflow} = Object.assign({}, defaults, options)

  if (resolution < 3) throw new Error('resolution must be greater then 3')

  startAngle = Math.abs(startAngle) > 360 ? startAngle % 360 : startAngle
  angle = Math.abs(angle) > 360 ? angle % 360 : angle

  let endAngle = startAngle + angle
  endAngle = Math.abs(endAngle) > 360 ? endAngle % 360 : endAngle

  if (endAngle < startAngle) {
    let x = startAngle
    startAngle = endAngle
    endAngle = x
  }
  let totalRotation = endAngle - startAngle
  if (totalRotation <= 0.0) totalRotation = 360

  // are we dealing with a positive or negative angle (for normals flipping)
  const positive = true // angle > 0

  let segments = resolution
  if (Math.abs(totalRotation) < 360) {
    // adjust the segments to achieve the total rotation requested
    let anglePerSegment = 360 / segments
    segments = Math.floor(Math.abs(totalRotation) / anglePerSegment)
    if (Math.abs(totalRotation) > (segments * anglePerSegment)) segments++
  }

  // console.log('startAngle: '+startAngle)
  // console.log('endAngle: '+endAngle)
  // console.log(totalRotation)
  // console.log(segments)

  // convert baseshape to just an array of points, easier to deal with
  let shapePoints = geom2.toPoints(geometry)

  // determine if the rotate extrude can be computed in the first place
  // ie all the points have to be either x > 0 or x < 0

  // generic solution to always have a valid solid, even if points go beyond x/ -x
  // 1. split points up between all those on the 'left' side of the axis (x<0) & those on the 'righ' (x>0)
  // 2. for each set of points do the extrusion operation IN OPOSITE DIRECTIONS
  // 3. union the two resulting solids

  // 1. alt : OR : just cap of points at the axis ?

  const pointsWithNegativeX = shapePoints.filter(x => x[0] < 0)
  const pointsWithPositiveX = shapePoints.filter(x => x[0] >= 0)
  const arePointsWithNegAndPosX = pointsWithNegativeX.length > 0 && pointsWithPositiveX.length > 0

  if (arePointsWithNegAndPosX && overflow === 'cap') {
    if (pointsWithNegativeX.length > pointsWithPositiveX.length) {
      shapePoints = shapePoints.map(function (point) {
        return [Math.min(point[0], 0), point[1]]
      })
    } else if (pointsWithPositiveX.length >= pointsWithNegativeX.length) {
      shapePoints = shapePoints.map(function (point) {
        return [Math.max(point[0], 0), point[1]]
      })
    }
  }

  // for each of the intermediary steps in the extrusion
  let length = shapePoints.length
  let polygons = []
  for (let i = 1; i < segments + 1; i++) {
    // for each side of the 2d shape
    for (let j = 0; j < length; j++) {
      // 2 points of a side
      const curPoint = shapePoints[j]
      const nextPoint = shapePoints[(j + 1) % length]

      // compute matrix for current and next segment angle
      let prevMatrix = mat4.fromZRotation(degToRad(((i - 1) / segments * totalRotation) + startAngle) * -1)
      let curMatrix = mat4.fromZRotation(degToRad((i / segments * totalRotation) + startAngle) * -1)

      const pointA = mat4.rightMultiplyVec3([curPoint[0], 0, curPoint[1]], prevMatrix)
      const pointAP = mat4.rightMultiplyVec3([curPoint[0], 0, curPoint[1]], curMatrix)
      const pointB = mat4.rightMultiplyVec3([nextPoint[0], 0, nextPoint[1]], prevMatrix)
      const pointBP = mat4.rightMultiplyVec3([nextPoint[0], 0, nextPoint[1]], curMatrix)

      let overlappingPoints = false
      if (Math.abs(pointA[0] - pointAP[0]) < EPS && Math.abs(pointB[1] - pointBP[1]) < EPS) {
        overlappingPoints = true
      }

      // we do not generate a single quad because:
      // 1. it does not allow eliminating unneeded triangles in case of overlapping points
      // 2. the current cleanup routines create degenerate shapes from those quads

      if (positive) {
        if (!overlappingPoints) {
          polygons.push(poly3.fromPoints([pointA, pointAP, pointBP]))
        }
        polygons.push(poly3.fromPoints([pointBP, pointB, pointA]))
      } else {
        polygons.push(poly3.fromPoints([pointA, pointB, pointBP]))
        if (!overlappingPoints) {
          polygons.push(poly3.fromPoints([pointBP, pointAP, pointA]))
        }
      }
    }
  }
  // if we do not do a full extrusion, we want caps at both ends (closed volume)
  if (Math.abs(totalRotation) < 360) {
    // we need to recreate the side with capped points where applicable
    const sideShape = geom2.fromPoints(shapePoints)

    const startMatrix = mat4.multiply(mat4.fromZRotation(degToRad(startAngle)), mat4.fromXRotation(degToRad(90)))
    const endMatrix = mat4.multiply(mat4.fromZRotation(degToRad(endAngle)), mat4.fromXRotation(degToRad(90)))
    let startCap = to3DPolygons({flipped: !positive}, sideShape)
    let endCap = to3DPolygons({flipped: positive}, sideShape)

    startCap = startCap.map((polygon) => poly3.transform(startMatrix, polygon))
    endCap = endCap.map((polygon) => poly3.transform(endMatrix, polygon))

    polygons = polygons.concat(endCap).concat(startCap)
  }
  let newgeometry = geom3.create(polygons)
  return newgeometry
}

module.exports = extrudeRotate
