const {isCAG} = require('../../core/utils')
const CSG = require('../../core/CSG')
const Tree = require('../../core/trees')

const canonicalize = require('../../core/utils/canonicalize')
const retesselate = require('../../core/utils/retesellate')
const {bounds} = require('../../core/utils/csgMeasurements')

const {fromFakeCSG} = require('../../core/CAGFactories')
const {toCSGWall} = require('../../core/CAGToOther')
const linearExtrude = require('../ops-extrusions/linearExtrude')

// FIXME should this be lazy ? in which case, how do we deal with 2D/3D combined
// TODO we should have an option to set behaviour as first parameter
/** union/ combine the given shapes
 * @param {Object(s)|Array} objects - objects to combine : can be given
 * - one by one: union(a,b,c) or
 * - as an array: union([a,b,c])
 * @returns {CSG} new CSG object, the union of all input shapes
 *
 * @example
 * let unionOfSpherAndCube = union(sphere(), cube())
 */
/**
   * Return a new CSG solid representing the space in either this solid or
   * in the given solids. Neither this solid nor the given solids are modified.
   * @param {CSG[]} csg - list of CSG objects
   * @returns {CSG} new CSG object
   * @example
   * let C = union(A, B)
   * @example
   * +-------+            +-------+
   * |       |            |       |
   * |   A   |            |       |
   * |    +--+----+   =   |       +----+
   * +----+--+    |       +----+       |
   *      |   B   |            |       |
   *      |       |            |       |
   *      +-------+            +-------+
*/
function union () {
  let options = {}
  const defaults = {
    extrude2d: false
  }
  let o
  let i = 0
  let a = arguments
  if (a[0].length) a = a[0]
  if ('extrude2d' in a[0]) { // first parameter is options
    options = Object.assign({}, defaults, a[0])
    o = a[i++]
  }

  o = a[i++]

  // TODO: add option to be able to set this?
  if ((typeof (a[i]) === 'object') && isCAG(a[i]) && options.extrude2d) {
    o = linearExtrude({height: 0.1}, a[i]) // -- convert a 2D shape to a thin solid, note: do not a[i] = a[i].extrude()
  }
  for (; i < a.length; i++) {
    let obj = a[i]

    if ((typeof (a[i]) === 'object') && isCAG(a[i]) && options.extrude2d) {
      obj = linearExtrude({height: 0.1}, a[i]) // -- convert a 2D shape to a thin solid:
    }
    o = _union([o, obj])
  }
  return o
}

const _union = function (csg) {
  let csgs
  if (csg instanceof Array) {
    csgs = csg.slice(0)
  } else {
    csgs = [csg]
  }

  let i
  // combine csg pairs in a way that forms a balanced binary tree pattern
  for (i = 1; i < csgs.length; i += 2) {
    csgs.push(unionSub(csgs[i - 1], csgs[i]))
  }
  return canonicalize(retesselate(csgs[i - 1]))
}

const unionSub = function (otherCsg, csg, doRetesselate, doCanonicalize) {
  if (!mayOverlap(otherCsg, csg)) {
    return unionForNonIntersecting(otherCsg, csg)
  } else {
    let a = new Tree(otherCsg.polygons)
    let b = new Tree(csg.polygons)
    a.clipTo(b, false)

          // b.clipTo(a, true); // ERROR: this doesn't work
    b.clipTo(a)
    b.invert()
    b.clipTo(a)
    b.invert()

    let newpolygons = a.allPolygons().concat(b.allPolygons())
    let result = CSG.fromPolygons(newpolygons)
    result.properties = otherCsg.properties._merge(csg.properties)
    if (doRetesselate) result = result.reTesselated()
    if (doCanonicalize) result = result.canonicalized()
    return result
  }
}

// Like union, but when we know that the two solids are not intersecting
// Do not use if you are not completely sure that the solids do not intersect!
const unionForNonIntersecting = function (otherCsg, csg) {
  let newpolygons = otherCsg.polygons.concat(csg.polygons)
  let result = CSG.fromPolygons(newpolygons)
  result.properties = otherCsg.properties._merge(csg.properties)
  result.isCanonicalized = otherCsg.isCanonicalized && csg.isCanonicalized
  result.isRetesselated = otherCsg.isRetesselated && csg.isRetesselated
  return result
}

  /** returns true if there is a possibility that the two solids overlap
   * returns false if we can be sure that they do not overlap
   * NOTE: this is critical as it is used in UNIONs
   * @param  {CSG} csg
   */
const mayOverlap = function (otherCsg, csg) {
  if ((otherCsg.polygons.length === 0) || (csg.polygons.length === 0)) {
    return false
  } else {
    let mybounds = bounds(otherCsg)
    let otherbounds = bounds(csg)
    if (mybounds[1].x < otherbounds[0].x) return false
    if (mybounds[0].x > otherbounds[1].x) return false
    if (mybounds[1].y < otherbounds[0].y) return false
    if (mybounds[0].y > otherbounds[1].y) return false
    if (mybounds[1].z < otherbounds[0].z) return false
    if (mybounds[0].z > otherbounds[1].z) return false
    return true
  }
}

const union2d = function (otherCag, cag) {
  let cags
  if (cag instanceof Array) {
    cags = cag
  } else {
    cags = [cag]
  }
  let r = toCSGWall(otherCag, -1, 1)
  r = _union(r,
    cags.map(function (cag) {
      return retesselate(toCSGWall(cag, -1, 1))
    }), false, false)
  return canonicalize(fromFakeCSG(r))
}

union.unionSub = unionSub
module.exports = union
