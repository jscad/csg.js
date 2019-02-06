const canonicalize = require('./canonicalize')
const clippingToPolygonArray = require('./clippingToPolygonArray')
const fromPolygonArray = require('./fromPolygonArray')
const polygonClippingIntersection = require('polygon-clipping').intersection;

/** Produce a surface that is the intersection of all provided surfaces.
  * The intersection of no surfaces is the empty surface.
  * The intersection of one surface is that surface.
  * @param {Array<surface>} surfaces - the surfaces to intersect.
  * @returns {surface} the intersection of surfaces.
  * @example
  * let C = difference(A, B)
  * @example
  * +-------+            +-------+
  * |       |            |   C   |
  * |   A   |            |       |
  * |    +--+----+   =   |    +--+
  * +----+--+    |       +----+
  *      |   B   |
  *      |       |
  *      +-------+
  */
const intersection = (...surfaces) => {
  switch (surfaces.length) {
    case 0:
      return fromPolygonArray({}, [])
    case 1:
      return surfaces[0]
    default: {
      const combined = surfaces.map(surface => canonicalize(surface).polygons)
      return fromPolygonArray(
                 {},
                 clippingToPolygonArray(polygonClippingIntersection(...combined)))
    }
  }
}

module.exports = intersection
