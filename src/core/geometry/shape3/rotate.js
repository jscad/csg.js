rotate: function (rotationCenter, rotationAxis, degrees) {
  return this.transform(Matrix4x4.rotation(rotationCenter, rotationAxis, degrees))
},
