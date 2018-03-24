const {isCAG} = require('../../core/utils')
const CSG = require('../../core/CSG')
const Tree = require('../../core/trees')

const canonicalize = require('../../core/utils/canonicalize')
const retesselate = require('../../core/utils/retesellate')

const {fromFakeCSG} = require('../../core/CAGFactories')
const {toCSGWall} = require('../../core/CAGToOther')

/** difference/ subtraction of the given shapes ie:
 * cut out C From B From A ie : a - b - c etc
 * @param {Object(s)|Array} objects - objects to subtract
 * can be given
 * - one by one: difference(a,b,c) or
 * - as an array: difference([a,b,c])
 * @returns {CSG} new CSG object, the difference of all input shapes
 *
 * @example
 * let differenceOfSpherAndCube = difference(sphere(), cube())
 */
function difference () {
  let object
  let i = 0
  let a = arguments
  if (a[0].length) a = a[0]
  for (object = a[i++]; i < a.length; i++) {
    if (isCAG(a[i])) {
      object = subtract(object, a[i])
    } else {
      object = subtract(object, a[i])// .setColor(1, 1, 0)) // -- color the cuts
    }
  }
  return object
}

/**
   * Return a new CSG solid representing space in this solid but
   * not in the given solids. Neither this solid nor the given solids are modified.
   * @param {CSG[]} csg - list of CSG objects
   * @returns {CSG} new CSG object
   * @example
   * let C = A.subtract(B)
   * @example
   * +-------+            +-------+
   * |       |            |       |
   * |   A   |            |       |
   * |    +--+----+   =   |    +--+
   * +----+--+    |       +----+
   *      |   B   |
   *      |       |
   *      +-------+
   */
const subtract = function (otherCsg, csg) {
  let csgs
  if (csg instanceof Array) {
    csgs = csg
  } else {
    csgs = [csg]
  }
  let result = otherCsg
  for (let i = 0; i < csgs.length; i++) {
    let islast = (i === (csgs.length - 1))
    result = subtractSub(result, csgs[i], islast, islast)
  }
  return result
}

const subtractSub = function (otherCsg, csg, doRetesselate, doCanonicalize) {
  let a = new Tree(otherCsg.polygons)
  let b = new Tree(csg.polygons)
  a.invert()
  a.clipTo(b)
  b.clipTo(a, true)
  a.addPolygons(b.allPolygons())
  a.invert()
  let result = CSG.fromPolygons(a.allPolygons())
  result.properties = otherCsg.properties._merge(csg.properties)
  if (doRetesselate) result = retesselate(result)
  if (doCanonicalize) result = canonicalize(result)
  return result
}

const subtract2d = function (ohterCag, cag) {
  let cags
  if (cag instanceof Array) {
    cags = cag
  } else {
    cags = [cag]
  }
  let r = toCSGWall(ohterCag, -1, 1)
  cags.map(function (cag) {
    r = subtractSub(r, toCSGWall(cag, -1, 1), false, false)
  })
  r = retesselate(r)
  r = canonicalize(r)
  r = fromFakeCSG(r)
  r = canonicalize(r)
  return r
}

module.exports = difference
