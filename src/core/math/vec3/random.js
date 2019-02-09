const abs = require('./abs')
const create = require('./create')

// find a vector that is somewhat perpendicular to this one
const random = (vec) => {
  const out = create()
  abs(out, vec)
  if ((out[0] <= out[1]) && (out[0] <= out[2])) {
    out[0] = 1
    out[1] = 0
    out[2] = 0
  } else if ((out[1] <= out[0]) && (out[1] <= out[2])) {
    out[0] = 0
    out[1] = 1
    out[2] = 0
  } else {
    out[0] = 0
    out[1] = 0
    out[2] = 1
  }
  return out
}

module.exports = random
