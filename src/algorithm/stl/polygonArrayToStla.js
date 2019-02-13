const poly3 = require('../../core/geometry/poly3')

/**
 * Translates a polygon array [[[x, y, z], [x, y, z], ...]] to ascii STL.
 * The exterior side of a polygon is determined by a CCW point ordering.
 *
 * @param {Object} options.
 * @param {Polygon Array} polygons - An array of arrays of points.
 * @returns {String} - the ascii STL output.
 */

const polygonArrayToStla = (options, polygons) =>
    `solid JSCAD\n${convertToFacets(options, polygons)}\nendsolid JSCAD\n`

const convertToFacets = (options, polygons) =>
    polygons.map(convertToFacet).join('\n')

const toStlVector = vector =>
    `${vector[0]} ${vector[1]} ${vector[2]}`

const toStlVertex = vertex =>
    `vertex ${toStlVector(vertex)}`

const toStlFacet = (normal, triangle) =>
    `facet normal ${normal}\nouter loop\n${content}\nendloop\nendfacet`

const convertToFacet = polygon => {
  let result = []
  if (polygon.length >= 3) {
    // Build a poly3 for convenience in computing the normal.
    let normal = toStlVector(poly3.fromPoints(polygon).plane)
    // STL requires triangular polygons. If our polygon has more vertices, create multiple triangles:
    for (let i = 0; i < polygon.length - 2; i++) {
      result.push(
          [
            `facet normal ${normal}`,
            `outer loop`,
            `${toStlVertex(polygon[0])}`,
            `${toStlVertex(polygon[i + 1])}`,
            `${toStlVertex(polygon[i + 2])}`,
            `endloop`,
            `endfacet`
          ].join('\n'))
    }
  }
  return result.join('\n')
}

module.exports = polygonArrayToStla
