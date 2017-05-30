// ////////////////////////////////////
CAG.fuzzyCAGFactory = function () {
  this.vertexfactory = new CSG.fuzzyFactory(2, CSG.EPS)
}

CAG.fuzzyCAGFactory.prototype = {
  getVertex: function (sourcevertex) {
    var elements = [sourcevertex.pos._x, sourcevertex.pos._y]
    var result = this.vertexfactory.lookupOrCreate(elements, function (els) {
      return sourcevertex
    })
    return result
  },

  getSide: function (sourceside) {
    var vertex0 = this.getVertex(sourceside.vertex0)
    var vertex1 = this.getVertex(sourceside.vertex1)
    return new CAG.Side(vertex0, vertex1)
  },

  getCAG: function (sourcecag) {
    var _this = this
    var newsides = sourcecag.sides.map(function (side) {
      return _this.getSide(side)
    })
        // remove bad sides (mostly a user input issue)
        .filter(function (side) {
          return side.length() > CSG.EPS
        })
    return CAG.fromSides(newsides)
  }
}
