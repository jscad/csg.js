const Tree = require('./trees')
const Polygon = require('./math/Polygon3')

const Matrix4x4 = require('./math/Matrix4')
const Vector3 = require('./math/Vector3')
const Plane = require('./math/Plane')

const Properties = require('./Properties')
const {toTriangles} = require('./CSGToOther')

const fixTJunctions = require('./utils/fixTJunctions')
const canonicalize = require('./utils/canonicalize')
const retesselate = require('./utils/retesellate')
const {bounds} = require('./utils/csgMeasurements')

/** Class CSG
 * Holds a binary space partition tree representing a 3D solid. Two solids can
 * be combined using the `union()`, `subtract()`, and `intersect()` methods.
 * @constructor
 */
let CSG = function () {
  this.polygons = []
  this.properties = new Properties()
  this.isCanonicalized = true
  this.isRetesselated = true
}

// this is a method instead of an external function to avoid circular dependencies
// ie CSG needs fromPolygons internally which itself creates CSG objects
CSG.fromPolygons = (polygons) => {
  let csg = new CSG()
  csg.polygons = polygons
  csg.isCanonicalized = false
  csg.isRetesselated = false
  return csg
}

CSG.prototype = {
  /**
   * Return a new CSG solid representing the space in either this solid or
   * in the given solids. Neither this solid nor the given solids are modified.
   * @param {CSG[]} csg - list of CSG objects
   * @returns {CSG} new CSG object
   * @example
   * let C = A.union(B)
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
  union: function (csg) {
    let csgs
    if (csg instanceof Array) {
      csgs = csg.slice(0)
      csgs.push(this)
    } else {
      csgs = [this, csg]
    }

    let i
    // combine csg pairs in a way that forms a balanced binary tree pattern
    for (i = 1; i < csgs.length; i += 2) {
      csgs.push(csgs[i - 1].unionSub(csgs[i]))
    }
    return csgs[i - 1].reTesselated().canonicalized()
  },

  unionSub: function (csg, retesselate, canonicalize) {
    if (!this.mayOverlap(csg)) {
      return this.unionForNonIntersecting(csg)
    } else {
      let a = new Tree(this.polygons)
      let b = new Tree(csg.polygons)
      a.clipTo(b, false)

            // b.clipTo(a, true); // ERROR: this doesn't work
      b.clipTo(a)
      b.invert()
      b.clipTo(a)
      b.invert()

      let newpolygons = a.allPolygons().concat(b.allPolygons())
      let result = CSG.fromPolygons(newpolygons)
      result.properties = this.properties._merge(csg.properties)
      if (retesselate) result = result.reTesselated()
      if (canonicalize) result = result.canonicalized()
      return result
    }
  },

  // Like union, but when we know that the two solids are not intersecting
  // Do not use if you are not completely sure that the solids do not intersect!
  unionForNonIntersecting: function (csg) {
    let newpolygons = this.polygons.concat(csg.polygons)
    let result = CSG.fromPolygons(newpolygons)
    result.properties = this.properties._merge(csg.properties)
    result.isCanonicalized = this.isCanonicalized && csg.isCanonicalized
    result.isRetesselated = this.isRetesselated && csg.isRetesselated
    return result
  },

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
  subtract: function (csg) {
    let csgs
    if (csg instanceof Array) {
      csgs = csg
    } else {
      csgs = [csg]
    }
    let result = this
    for (let i = 0; i < csgs.length; i++) {
      let islast = (i === (csgs.length - 1))
      result = result.subtractSub(csgs[i], islast, islast)
    }
    return result
  },

  subtractSub: function (csg, retesselate, canonicalize) {
    let a = new Tree(this.polygons)
    let b = new Tree(csg.polygons)
    a.invert()
    a.clipTo(b)
    b.clipTo(a, true)
    a.addPolygons(b.allPolygons())
    a.invert()
    let result = CSG.fromPolygons(a.allPolygons())
    result.properties = this.properties._merge(csg.properties)
    if (retesselate) result = result.reTesselated()
    if (canonicalize) result = result.canonicalized()
    return result
  },

  /**
   * Return a new CSG solid representing space in both this solid and
   * in the given solids. Neither this solid nor the given solids are modified.
   * @param {CSG[]} csg - list of CSG objects
   * @returns {CSG} new CSG object
   * @example
   * let C = A.intersect(B)
   * @example
   * +-------+
   * |       |
   * |   A   |
   * |    +--+----+   =   +--+
   * +----+--+    |       +--+
   *      |   B   |
   *      |       |
   *      +-------+
   */
  intersect: function (csg) {
    let csgs
    if (csg instanceof Array) {
      csgs = csg
    } else {
      csgs = [csg]
    }
    let result = this
    for (let i = 0; i < csgs.length; i++) {
      let islast = (i === (csgs.length - 1))
      result = result.intersectSub(csgs[i], islast, islast)
    }
    return result
  },

  intersectSub: function (csg, retesselate, canonicalize) {
    let a = new Tree(this.polygons)
    let b = new Tree(csg.polygons)
    a.invert()
    b.clipTo(a)
    b.invert()
    a.clipTo(b)
    b.clipTo(a)
    a.addPolygons(b.allPolygons())
    a.invert()
    let result = CSG.fromPolygons(a.allPolygons())
    result.properties = this.properties._merge(csg.properties)
    if (retesselate) result = result.reTesselated()
    if (canonicalize) result = result.canonicalized()
    return result
  },

  /**
   * Return a new CSG solid with solid and empty space switched.
   * This solid is not modified.
   * @returns {CSG} new CSG object
   * @example
   * let B = A.invert()
   */
  invert: function () {
    let flippedpolygons = this.polygons.map(function (p) {
      return p.flipped()
    })
    return CSG.fromPolygons(flippedpolygons)
    // TODO: flip properties?
  },

  // Affine transformation of CSG object. Returns a new CSG object
  transform1: function (matrix4x4) {
    let newpolygons = this.polygons.map(function (p) {
      return p.transform(matrix4x4)
    })
    let result = CSG.fromPolygons(newpolygons)
    result.properties = this.properties._transform(matrix4x4)
    result.isRetesselated = this.isRetesselated
    return result
  },

  /**
   * Return a new CSG solid that is transformed using the given Matrix.
   * Several matrix transformations can be combined before transforming this solid.
   * @param {CSG.Matrix4x4} matrix4x4 - matrix to be applied
   * @returns {CSG} new CSG object
   * @example
   * var m = new CSG.Matrix4x4()
   * m = m.multiply(CSG.Matrix4x4.rotationX(40))
   * m = m.multiply(CSG.Matrix4x4.translation([-.5, 0, 0]))
   * let B = A.transform(m)
   */
  transform: function (matrix4x4) {
    let ismirror = matrix4x4.isMirroring()
    let transformedvertices = {}
    let transformedplanes = {}
    let newpolygons = this.polygons.map(function (p) {
      let newplane
      let plane = p.plane
      let planetag = plane.getTag()
      if (planetag in transformedplanes) {
        newplane = transformedplanes[planetag]
      } else {
        newplane = plane.transform(matrix4x4)
        transformedplanes[planetag] = newplane
      }
      let newvertices = p.vertices.map(function (v) {
        let newvertex
        let vertextag = v.getTag()
        if (vertextag in transformedvertices) {
          newvertex = transformedvertices[vertextag]
        } else {
          newvertex = v.transform(matrix4x4)
          transformedvertices[vertextag] = newvertex
        }
        return newvertex
      })
      if (ismirror) newvertices.reverse()
      return new Polygon(newvertices, p.shared, newplane)
    })
    let result = CSG.fromPolygons(newpolygons)
    result.properties = this.properties._transform(matrix4x4)
    result.isRetesselated = this.isRetesselated
    result.isCanonicalized = this.isCanonicalized
    return result
  },

  translate: function (v) {
    return this.transform(Matrix4x4.translation(v))
  },

  scale: function (f) {
    return this.transform(Matrix4x4.scaling(f))
  },

  rotateX: function (deg) {
    return this.transform(Matrix4x4.rotationX(deg))
  },

  rotateY: function (deg) {
    return this.transform(Matrix4x4.rotationY(deg))
  },

  rotateZ: function (deg) {
    return this.transform(Matrix4x4.rotationZ(deg))
  },

  rotate: function (rotationCenter, rotationAxis, degrees) {
    return this.transform(Matrix4x4.rotation(rotationCenter, rotationAxis, degrees))
  },

  mirrored: function (plane) {
    return this.transform(Matrix4x4.mirroring(plane))
  },

  mirroredX: function () {
    let plane = new Plane(Vector3.Create(1, 0, 0), 0)
    return this.mirrored(plane)
  },

  mirroredY: function () {
    let plane = new Plane(Vector3.Create(0, 1, 0), 0)
    return this.mirrored(plane)
  },

  mirroredZ: function () {
    let plane = new Plane(Vector3.Create(0, 0, 1), 0)
    return this.mirrored(plane)
  },

  // ALIAS !
  canonicalized: function () {
    return canonicalize(this)
  },

  // ALIAS !
  reTesselated: function () {
    return retesselate(this)
  },

  // ALIAS !
  fixTJunctions: function () {
    return fixTJunctions(CSG.fromPolygons, this)
  },

  // ALIAS !
  getBounds: function () {
    return bounds(this)
  },

  /** returns true if there is a possibility that the two solids overlap
   * returns false if we can be sure that they do not overlap
   * NOTE: this is critical as it is used in UNIONs
   * @param  {CSG} csg
   */
  mayOverlap: function (csg) {
    if ((this.polygons.length === 0) || (csg.polygons.length === 0)) {
      return false
    } else {
      let mybounds = bounds(this)
      let otherbounds = bounds(csg)
      if (mybounds[1].x < otherbounds[0].x) return false
      if (mybounds[0].x > otherbounds[1].x) return false
      if (mybounds[1].y < otherbounds[0].y) return false
      if (mybounds[0].y > otherbounds[1].y) return false
      if (mybounds[1].z < otherbounds[0].z) return false
      if (mybounds[0].z > otherbounds[1].z) return false
      return true
    }
  },

  /**
   * Connect a solid to another solid, such that two Connectors become connected
   * @param  {Connector} myConnector a Connector of this solid
   * @param  {Connector} otherConnector a Connector to which myConnector should be connected
   * @param  {Boolean} mirror false: the 'axis' vectors of the connectors should point in the same direction
   * true: the 'axis' vectors of the connectors should point in opposite direction
   * @param  {Float} normalrotation degrees of rotation between the 'normal' vectors of the two
   * connectors
   * @returns {CSG} this csg, tranformed accordingly
   */
  connectTo: function (myConnector, otherConnector, mirror, normalrotation) {
    let matrix = myConnector.getTransformationTo(otherConnector, mirror, normalrotation)
    return this.transform(matrix)
  },

  /**
   * set the .shared property of all polygons
   * @param  {Object} shared
   * @returns {CSG} Returns a new CSG solid, the original is unmodified!
   */
  setShared: function (shared) {
    let polygons = this.polygons.map(function (p) {
      return new Polygon(p.vertices, shared, p.plane)
    })
    let result = CSG.fromPolygons(polygons)
    result.properties = this.properties // keep original properties
    result.isRetesselated = this.isRetesselated
    result.isCanonicalized = this.isCanonicalized
    return result
  },

  /** sets the color of this csg: non mutating, returns a new CSG
   * @param  {Object} args
   * @returns {CSG} a copy of this CSG, with the given color
   */
  setColor: function (args) {
    let newshared = Polygon.Shared.fromColor.apply(this, arguments)
    return this.setShared(newshared)
  },

  /**
   * Returns an array of values for the requested features of this solid.
   * Supported Features: 'volume', 'area'
   * @param {String[]} features - list of features to calculate
   * @returns {Float[]} values
   * @example
   * let volume = A.getFeatures('volume')
   * let values = A.getFeatures('area','volume')
   */
  getFeatures: function (features) {
    if (!(features instanceof Array)) {
      features = [features]
    }
    let result = toTriangles(this).map(function (triPoly) {
      return triPoly.getTetraFeatures(features)
    })
    .reduce(function (pv, v) {
      return v.map(function (feat, i) {
        return feat + (pv === 0 ? 0 : pv[i])
      })
    }, 0)
    return (result.length === 1) ? result[0] : result
  },

  toString: function () {
    let result = 'CSG solid:\n'
    this.polygons.map(function (p) {
      result += p.toString()
    })
    return result
  }
}

module.exports = CSG
