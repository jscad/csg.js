
  const transform = require('./transform')

  function rotateY (shape3, deg) {
    return transform(shape3, Matrix4x4.rotationY(deg))
  }

  module.exports = rotateY
