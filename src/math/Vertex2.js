CAG.Vertex = function (pos) {
  this.pos = pos
}

CAG.Vertex.fromObject = function (obj) {
  return new CAG.Vertex(new CSG.Vector2D(obj.pos._x, obj.pos._y))
}

CAG.Vertex.prototype = {
  toString: function () {
    return '(' + this.pos.x.toFixed(5) + ',' + this.pos.y.toFixed(5) + ')'
  },
  getTag: function () {
    var result = this.tag
    if (!result) {
      result = CSG.getTag()
      this.tag = result
    }
    return result
  }
}
