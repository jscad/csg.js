const transform = require('./transform')

function rotateX (shape, deg) {
  return transform(shape, Matrix4x4.rotationX(deg))
}

module.exports = rotateX
