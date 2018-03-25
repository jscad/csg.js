const Matrix4x4 = require('./math/Matrix4')
const Vector3 = require('./math/Vector3')
const Plane = require('./math/Plane')

const {isCAGValid, isSelfIntersecting} = require('./utils/cagValidation')
const {getBounds} = require('./utils/cagMeasurements')

/**
 * Class CAG
 * Holds a solid area geometry like CSG but 2D.
 * Each area consists of a number of sides.
 * Each side is a line between 2 points.
 * @constructor
 */
let CAG = function () {
  this.sides = []
  this.isCanonicalized = false
}

// added here to avoid circular dependencies
CAG.fromSides = function (sides) {
  let cag = new CAG()
  cag.sides = sides
  return cag
}

CAG.prototype = {
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

  transform: function (matrix4x4) {
    let ismirror = matrix4x4.isMirroring()
    let newsides = this.sides.map(function (side) {
      return side.transform(matrix4x4)
    })
    let result = CAG.fromSides(newsides)
    if (ismirror) {
      result = result.flipped()
    }
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

  flipped: function () {
    let newsides = this.sides.map(function (side) {
      return side.flipped()
    })
    newsides.reverse()
    return CAG.fromSides(newsides)
  },

  // ALIAS !
  getBounds: function () {
    return getBounds(this)
  },
  // ALIAS !
  isSelfIntersecting: function (debug) {
    return isSelfIntersecting(this, debug)
  },

  // ALIAS !
  check: function () {
    return isCAGValid(this)
  },

  // All the toXXX functions
  toString: function () {
    let result = 'CAG (' + this.sides.length + ' sides):\n'
    this.sides.map(function (side) {
      result += '  ' + side.toString() + '\n'
    })
    return result
  }
}

module.exports = CAG
