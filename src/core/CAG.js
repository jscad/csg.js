const {Connector} = require('./connectors')
const Vertex3D = require('./math/Vertex3')
const Vector2D = require('./math/Vector2')
const Vector3D = require('./math/Vector3')
const Polygon = require('./math/Polygon3')

const {fromPolygons} = require('./CSGFactories')
const {fromSides, fromFakeCSG} = require('./CAGFactories')

const canonicalize = require('./utils/canonicalize')
const retesselate = require('./utils/retesellate')
const {isCAGValid, isSelfIntersecting} = require('./utils/cagValidation')
const {area, getBounds} = require('./utils/cagMeasurements')

// all of these are good candidates for elimination in this scope, since they are part of a functional api
const {extrude, rotateExtrude} = require('../api/ops-extrusions')
const center = require('../api/center')
const {expand, contract, expandedShellOfCAG} = require('../api/ops-expandContract')
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
    let result = fromSides(newsides)
    if (ismirror) {
      result = result.flipped()
    }
    return result
  },

  flipped: function () {
    let newsides = this.sides.map(function (side) {
      return side.flipped()
    })
    newsides.reverse()
    return fromSides(newsides)
  },

  // ALIAS !
  center: function (axes) {
    return center({axes: axes}, [this])
  },

  // ALIAS !
  expandedShell: function (radius, resolution) {
    return expandedShellOfCAG(this, radius, resolution)
  },

  // ALIAS !
  expand: function (radius, resolution) {
    return expand(this, radius, resolution)
  },

  contract: function (radius, resolution) {
    return contract(this, radius, resolution)
  },

  // ALIAS !
  area: function () {
    return area(this)
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
  extrude: function (options) {
    return extrude(this, options)
  },

  // ALIAS !
  rotateExtrude: function (options) { // FIXME options should be optional
    return rotateExtrude(this, options)
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
  },

  _toVector3DPairs: function (m) {
        // transform m
    let pairs = this.sides.map(function (side) {
      let p0 = side.vertex0.pos
      let p1 = side.vertex1.pos
      return [Vector3D.Create(p0.x, p0.y, 0),
        Vector3D.Create(p1.x, p1.y, 0)]
    })
    if (typeof m !== 'undefined') {
      pairs = pairs.map(function (pair) {
        return pair.map(function (v) {
          return v.transform(m)
        })
      })
    }
    return pairs
  }
}

module.exports = CAG
