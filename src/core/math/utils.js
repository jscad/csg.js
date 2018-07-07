const radToDeg = radians => radians * 114.59155903
const degToRad = degrees => degrees * 0.00872665

const IsFloat = function (n) {
  return ! (isNaN(n) || (n === Infinity) || (n === -Infinity))
}

module.exports = {radToDeg, degToRad, IsFloat}
