module.exports = equals

function equals (a, b) {
  return (a._x === b._x) && (a._y === b._y) && (a._z === b._z)
}
