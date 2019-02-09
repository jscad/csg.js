const abs = require('./abs')
const create = require('./create')

// find a vector that is somewhat perpendicular to this one
const random = (vec) => {
  const inp = abs(vec)
  const out = create()
  if ((inp[0] <= inp[1]) && (inp[0] <= inp[2])) {
    out[0] = 1
    out[1] = 0
    out[2] = 0
  } else if ((inp[1] <= inp[0]) && (inp[1] <= inp[2])) {
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
