const { CSG, CAG } = require('@jscad/csg')
const {cagToPointsArray, clamp, rightMultiply1x3VectorToArray, polygonFromPoints} = require('./helpers')
// -- 2D to 3D primitives

function linear_extrude (p, s) {
  // return
  let h = 1
  let off = 0
  let twist = 0
  let slices = 10
  /* convexity = 10, */

  if (p.height) h = p.height
  // if(p.convexity) convexity = p.convexity      // abandoned
  if (p.twist) twist = p.twist
  if (p.slices) slices = p.slices
  var o = s.extrude({offset: [0, 0, h], twistangle: twist, twiststeps: slices})
  if (p.center === true) {
    var b = [ ]
    b = o.getBounds() // b[0] = min, b[1] = max
    off = b[1].plus(b[0])
    off = off.times(-0.5)
    o = o.translate(off)
  }
  return o
}

/** rotate extrude / revolve
 * @param {Object} [options] - options for construction
 * @param {Integer} [options.fn=1] - resolution/number of segments of the extrusion
 * @param {Float} [options.startAngle=1] - start angle of the extrusion, in degrees
 * @param {Float} [options.angle=1] - angle of the extrusion, in degrees
 * @param {Float} [options.overflow='cap'] - what to do with points outside of bounds (+ / - x) :
 * defaults to capping those points to 0 (only supported behaviour for now)
 * @param {CAG} baseShape input 2d shape
 * @returns {CSG} new extruded shape
 *
 * @example
 * let revolved = rotate_extrude({fn: 10}, square())
 */
function rotate_extrude (params, baseShape) {
  // note, we should perhaps alias this to revolve() as well
  const defaults = {
    fn: 32,
    startAngle: 0,
    angle: 360,
    overflow: 'cap'
  }
  params = Object.assign({}, defaults, params)
  let {fn, startAngle, angle, overflow} = params
  if (overflow !== 'cap') {
    throw new Error('only capping of overflowing points is supported !')
  }

  if (arguments.length < 2) { // FIXME: what the hell ??? just put params second !
    baseShape = params
  }
  // are we dealing with a positive or negative angle (for normals flipping)
  const flipped = angle > 0
  // limit actual angle between 0 & 360, regardless of direction
  const totalAngle = flipped ? clamp((startAngle + angle), 0, 360) : clamp((startAngle + angle), -360, 0)
  // adapt to the totalAngle : 1 extra segment per 45 degs if not 360 deg extrusion
  // needs to be at least one and higher then the input resolution
  const segments = Math.max(
    Math.floor(Math.abs(totalAngle) / 45),
    1,
    fn
  )
  // maximum distance per axis between two points before considering them to be the same
  const overlapTolerance = 0.00001
  // convert baseshape to just an array of points, easier to deal with
  let shapePoints = cagToPointsArray(baseShape)

  // determine if the rotate_extrude can be computed in the first place
  // ie all the points have to be either x > 0 or x < 0

  // generic solution to always have a valid solid, even if points go beyond x/ -x
  // 1. split points up between all those on the 'left' side of the axis (x<0) & those on the 'righ' (x>0)
  // 2. for each set of points do the extrusion operation IN OPOSITE DIRECTIONS
  // 3. union the two resulting solids

  // 1. alt : OR : just cap of points at the axis ?

  // console.log('shapePoints BEFORE', shapePoints, baseShape.sides)

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

  // console.log('negXs', pointsWithNegativeX, 'pointsWithPositiveX', pointsWithPositiveX, 'arePointsWithNegAndPosX', arePointsWithNegAndPosX)
 //  console.log('shapePoints AFTER', shapePoints, baseShape.sides)

  let polygons = []

  // for each of the intermediary steps in the extrusion
  for (let i = 1; i < segments + 1; i++) {
    // for each side of the 2d shape
    for (let j = 0; j < shapePoints.length - 1; j++) {
      // 2 points of a side
      const curPoint = shapePoints[j]
      const nextPoint = shapePoints[j + 1]

      // compute matrix for current and next segment angle
      let prevMatrix = CSG.Matrix4x4.rotationZ((i - 1) / segments * angle + startAngle)
      let curMatrix = CSG.Matrix4x4.rotationZ(i / segments * angle + startAngle)

      const pointA = rightMultiply1x3VectorToArray(prevMatrix, [curPoint[0], 0, curPoint[1]])
      const pointAP = rightMultiply1x3VectorToArray(curMatrix, [curPoint[0], 0, curPoint[1]])
      const pointB = rightMultiply1x3VectorToArray(prevMatrix, [nextPoint[0], 0, nextPoint[1]])
      const pointBP = rightMultiply1x3VectorToArray(curMatrix, [nextPoint[0], 0, nextPoint[1]])

      // console.log(`point ${j} edge connecting ${j} to ${j + 1}`)
      let overlappingPoints = false
      if (Math.abs(pointA[0] - pointAP[0]) < overlapTolerance && Math.abs(pointB[1] - pointBP[1]) < overlapTolerance) {
        // console.log('identical / overlapping points (from current angle and next one), what now ?')
        overlappingPoints = true
      }

      // we do not generate a single quad because:
      // 1. it does not allow eliminating unneeded triangles in case of overlapping points
      // 2. the current cleanup routines of csg.js create degenerate shapes from those quads
      // let polyPoints = [pointA, pointB, pointBP, pointAP]
      // polygons.push(polygonFromPoints(polyPoints))

      if (flipped) {
        // CW
        polygons.push(polygonFromPoints([pointA, pointB, pointBP]))
        if (!overlappingPoints) {
          polygons.push(polygonFromPoints([pointBP, pointAP, pointA]))
        }
      } else {
        // CCW
        if (!overlappingPoints) {
          polygons.push(polygonFromPoints([pointA, pointAP, pointBP]))
        }
        polygons.push(polygonFromPoints([pointBP, pointB, pointA]))
      }
    }
    // if we do not do a full extrusion, we want caps at both ends (closed volume)
    if (Math.abs(angle) < 360) {
      // we need to recreate the side with capped points where applicable
      const sideShape = CAG.fromPoints(shapePoints)
      const endMatrix = CSG.Matrix4x4.rotationX(90).multiply(
        CSG.Matrix4x4.rotationZ(-startAngle)
      )
      const endCap = sideShape._toPlanePolygons({flipped: flipped})
        .map(x => x.transform(endMatrix))

      const startMatrix = CSG.Matrix4x4.rotationX(90).multiply(
        CSG.Matrix4x4.rotationZ(-angle - startAngle)
      )
      const startCap = sideShape._toPlanePolygons({flipped: !flipped})
        .map(x => x.transform(startMatrix))
      polygons = polygons.concat(endCap).concat(startCap)
    }
  }
  return CSG.fromPolygons(polygons).reTesselated().canonicalized()
}

function rectangular_extrude (pa, p) {
  let w = 1
  let h = 1
  let fn = 8
  let closed = false
  let round = true
  if (p) {
    if (p.w) w = p.w
    if (p.h) h = p.h
    if (p.fn) fn = p.fn
    if (p.closed !== undefined) closed = p.closed
    if (p.round !== undefined) round = p.round
  }
  return new CSG.Path2D(pa, closed).rectangularExtrude(w, h, fn, round)
}

module.exports = {
  linear_extrude,
  rotate_extrude,
  rectangular_extrude
}
