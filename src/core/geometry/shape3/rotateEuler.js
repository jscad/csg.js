function rotateEulerAngles (alpha, beta, gamma, position) {
  position = position || [0, 0, 0]

  let Rz1 = Matrix4x4.rotationZ(alpha)
  let Rx = Matrix4x4.rotationX(beta)
  let Rz2 = Matrix4x4.rotationZ(gamma)
  let T = Matrix4x4.translation(new Vector3D(position))

  return this.transform(Rz2.multiply(Rx).multiply(Rz1).multiply(T))
}

module.exports = rotateEulerAngles
