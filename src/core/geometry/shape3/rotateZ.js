const transform = require('./transform')

function rotateZ (shape3, deg) {
  return transform(shape3, Matrix4x4.rotationZ(deg))
}

module.exports = rotateZ
