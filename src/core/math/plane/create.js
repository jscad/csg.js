/**
 * Creates a new, empty plane
 *
 * @returns {Array} a new plane
 */
function create () {
  var out = new Float32Array(4)
  out[0] = 0
  out[1] = 0
  out[2] = 0
  out[3] = 0
  return out
}

module.exports = create
