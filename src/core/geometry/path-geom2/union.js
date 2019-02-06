const canonicalize = require('./canonicalize')
const clippingToPolygonArray = require('./clippingToPolygonArray')
const fromPolygonArray = require('./fromPolygonArray')
const polygonClippingUnion = require('polygon-clipping').union;

/** Produces a surface that is the union of all provided surfaces.
  * The union of no surfaces is the empty surface.
  * The union of one surface is that surface.
  * @param {Array<surface>} surfaces - the surfaces to union.
  * @returns {surface} the union of the surfaces.
  */
const union = (...surfaces) => {
  switch (surfaces.length) {
    case 0:
      return fromPolygonArray({}, [])
    case 1:
      return surfaces[0]
    default: {
      const combined = surfaces.map(surface => canonicalize(surface).polygons)
      return fromPolygonArray(
                 {},
                 clippingToPolygonArray(polygonClippingUnion(...combined)))
    }
  }
}

module.exports = union
