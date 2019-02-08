/**
 * Creates values from a vec3 suitable for creating an equivalent vec3 via
 *   vec3.fromValues.
 *
 * @param {vec3} vector - the vector to create the values from.
 * @returns {Array<Number>} An array of three numbers.
 */
const toValues = vector => [vector[0], vector[1], vector[2]]

module.exports = toValues
