/**
 * Convert the given vec4 to a representative string
 *
 * @param {vec4} a vector to convert
 * @returns {String} representative string
 */

// Where does the magic number 9 come from?

const toString = (vec) => {
  return `(${vec[0].toFixed(9)}, ${vec[1].toFixed(9)}, ${vec[2].toFixed(9)}, ${vec[3].toFixed(9)})`
}

module.exports = toString
