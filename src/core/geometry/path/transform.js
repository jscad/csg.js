const canonicalize = require('./canonicalize')
const fromPointArray = require('./fromPointArray')
const vec3 = require('../../math/vec3')

/**
 * Produces a path by transforming all points in the provided path.
 * @param {mat4} matrix - the matrix to transform with.
 * @param {path2} path - the path to transform.
 * @returns {path2} - the transformed path.
 * @example
 * transform(fromZRotation(degToRad(90)), path)
 */
const transform = (matrix, path) =>
    fromPointArray(
        { closed: path.isClosed },
        canonicalize(path).points.map(point => vec3.transform(matrix, point)))

module.exports = transform
