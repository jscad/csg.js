const Matrix4x4 = require('./math/Matrix4')
const Vector3 = require('./math/Vector3')
const Plane = require('./math/Plane')

const {fromPolygons} = require('./CSGFactories')
const {fromFakeCSG} = require('./CAGFactories')

const canonicalize = require('./utils/canonicalize')
const retesselate = require('./utils/retesellate')
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
  union: function (cag) {
    let cags
    if (cag instanceof Array) {
      cags = cag
    } else {
      cags = [cag]
    }
    let r = this._toCSGWall(-1, 1)
    r = r.union(
            cags.map(function (cag) {
              return cag._toCSGWall(-1, 1).reTesselated()
            }), false, false)
    return fromFakeCSG(r).canonicalized()
  },

  subtract: function (cag) {
    let cags
    if (cag instanceof Array) {
      cags = cag
    } else {
      cags = [cag]
    }
    let r = this._toCSGWall(-1, 1)
    cags.map(function (cag) {
      r = r.subtractSub(cag._toCSGWall(-1, 1), false, false)
    })
    r = r.reTesselated()
    r = r.canonicalized()
    r = fromFakeCSG(r)
    r = r.canonicalized()
    return r
  },

  intersect: function (cag) {
    let cags
    if (cag instanceof Array) {
      cags = cag
    } else {
      cags = [cag]
    }
    let r = this._toCSGWall(-1, 1)
    cags.map(function (cag) {
      r = r.intersectSub(cag._toCSGWall(-1, 1), false, false)
    })
    r = r.reTesselated()
    r = r.canonicalized()
    r = fromFakeCSG(r)
    r = r.canonicalized()
    return r
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

  // ALIAS !
  canonicalized: function () {
    return canonicalize(this)
  },

  // ALIAS !
  reTesselated: function () {
    return retesselate(this)
  },

  // All the toXXX functions
  toString: function () {
    let result = 'CAG (' + this.sides.length + ' sides):\n'
    this.sides.map(function (side) {
      result += '  ' + side.toString() + '\n'
    })
    return result
  },

  _toCSGWall: function (z0, z1) {
    let polygons = this.sides.map(function (side) {
      return side.toPolygon3D(z0, z1)
    })
    return fromPolygons(polygons)
  }
}

module.exports = CAG
