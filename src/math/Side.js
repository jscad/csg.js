CAG.Side = function (vertex0, vertex1) {
  if (!(vertex0 instanceof CAG.Vertex)) throw new Error('Assertion failed')
  if (!(vertex1 instanceof CAG.Vertex)) throw new Error('Assertion failed')
  this.vertex0 = vertex0
  this.vertex1 = vertex1
}

CAG.Side.fromObject = function (obj) {
  var vertex0 = CAG.Vertex.fromObject(obj.vertex0)
  var vertex1 = CAG.Vertex.fromObject(obj.vertex1)
  return new CAG.Side(vertex0, vertex1)
}

CAG.Side._fromFakePolygon = function (polygon) {
    // this can happen based on union, seems to be residuals -
    // return null and handle in caller
  if (polygon.vertices.length < 4) {
    return null
  }
  var vert1Indices = []
  var pts2d = polygon.vertices.filter(function (v, i) {
    if (v.pos.z > 0) {
      vert1Indices.push(i)
      return true
    }
    return false
  })
    .map(function (v) {
      return new CSG.Vector2D(v.pos.x, v.pos.y)
    })
  if (pts2d.length != 2) {
    throw ('Assertion failed: _fromFakePolygon: not enough points found')
  }
  var d = vert1Indices[1] - vert1Indices[0]
  if (d == 1 || d == 3) {
    if (d == 1) {
      pts2d.reverse()
    }
  } else {
    throw ('Assertion failed: _fromFakePolygon: unknown index ordering')
  }
  var result = new CAG.Side(new CAG.Vertex(pts2d[0]), new CAG.Vertex(pts2d[1]))
  return result
}

CAG.Side.prototype = {
  toString: function () {
    return this.vertex0 + ' -> ' + this.vertex1
  },

  toPolygon3D: function (z0, z1) {
    var vertices = [
      new CSG.Vertex(this.vertex0.pos.toVector3D(z0)),
      new CSG.Vertex(this.vertex1.pos.toVector3D(z0)),
      new CSG.Vertex(this.vertex1.pos.toVector3D(z1)),
      new CSG.Vertex(this.vertex0.pos.toVector3D(z1))
    ]
    return new CSG.Polygon(vertices)
  },

  transform: function (matrix4x4) {
    var newp1 = this.vertex0.pos.transform(matrix4x4)
    var newp2 = this.vertex1.pos.transform(matrix4x4)
    return new CAG.Side(new CAG.Vertex(newp1), new CAG.Vertex(newp2))
  },

  flipped: function () {
    return new CAG.Side(this.vertex1, this.vertex0)
  },

  direction: function () {
    return this.vertex1.pos.minus(this.vertex0.pos)
  },

  getTag: function () {
    var result = this.tag
    if (!result) {
      result = CSG.getTag()
      this.tag = result
    }
    return result
  },

  lengthSquared: function () {
    var x = this.vertex1.pos.x - this.vertex0.pos.x,
      y = this.vertex1.pos.y - this.vertex0.pos.y
    return x * x + y * y
  },

  length: function () {
    return Math.sqrt(this.lengthSquared())
  }
}
