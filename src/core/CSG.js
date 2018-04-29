const Polygon3 = require('./math/Polygon3')

const Matrix4x4 = require('./math/Matrix4')
const Vector3 = require('./math/Vector3')
const Plane = require('./math/Plane')

const Properties = require('./Properties')

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
   * Helper function to chain operations on an object more easilly
   * This solid is not modified.
   * @returns {CSG} new CSG object
   * @example
   * let B = A
   *  .pipe(translate([10,20,0]))
   *  .pipe(union(C, D, E))
   */
  pipe: function (funtionToApply) {
    return funtionToApply(this, params)
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
      return new Polygon3(newvertices, p.shared, newplane)
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

  rotateEulerAngles: function (alpha, beta, gamma, position) {
    position = position || [0, 0, 0]

    let Rz1 = Matrix4x4.rotationZ(alpha)
    let Rx = Matrix4x4.rotationX(beta)
    let Rz2 = Matrix4x4.rotationZ(gamma)
    let T = Matrix4x4.translation(new Vector3D(position))

    return this.transform(Rz2.multiply(Rx).multiply(Rz1).multiply(T))
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
      return new Polygon3(p.vertices, shared, p.plane)
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
    let newshared = Polygon3.Shared.fromColor.apply(this, arguments)
    return this.setShared(newshared)
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
