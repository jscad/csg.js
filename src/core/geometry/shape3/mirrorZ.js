
  mirroredZ: function () {
    let plane = new Plane(Vector3.Create(0, 0, 1), 0)
    return this.mirrored(plane)
  }