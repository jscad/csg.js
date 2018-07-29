module.exports = toString

/**
 * Convert the given plane to readable form
 * @return {String} the contents of the plane in readable format
 */
function toString (a) {
  const n = a.splice(0,3)
  return '[normal: ' + n + ', w: ' + a[3] + ']'
}
