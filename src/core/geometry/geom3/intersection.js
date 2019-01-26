const Tree = require('../trees')

const fromPolygons = require('./fromPolygons')
const retessellate = require('./retessellate')
const canonicalize = require('./canonicalize')

/**
   * Return a new Geom3 solid representing space in both this solid and
   * in the given solids.
   * Immutable: Neither this solid nor the given solids are modified.
   * @param {Geom3[]} geometry - list of Geom3 objects
   * @returns {Geom3} new Geom3 object
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
const intersectSub = (ohterCsg, geometry, doRetesselate, doCanonicalize) => {
  const a = new Tree(ohterCsg.polygons)
  const b = new Tree(geometry.polygons)
  a.invert()
  b.clipTo(a)
  b.invert()
  a.clipTo(b)
  b.clipTo(a)
  a.addPolygons(b.allPolygons())
  a.invert()
  let result = fromPolygons(a.allPolygons())
  if (doCanonicalize) result = canonicalize(result)
  if (doRetesselate) result = retessellate(result)
  return result
}

const intersect = (otherGeom3, ...geometries) => {
  let result = otherGeom3
  for (let i = 0; i < geometries.length; i++) {
    const islast = (i === (geometries.length - 1))
    result = intersectSub(result, geometries[i], islast, islast)
  }
  return result
}

intersect.intersectSub = intersectSub

module.exports = intersect
