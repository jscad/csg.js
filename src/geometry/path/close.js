const clone = require('./clone')

/**
 * Produces a closed version of the path.
 * @params {path} path - the path to make a closed version of
 * @returns {path} a new closed path.
 */
const close = path => {
  const cloned = clone(path)
  cloned.isClosed = true
  return cloned
}

module.exports = close
