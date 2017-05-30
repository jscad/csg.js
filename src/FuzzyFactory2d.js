const {fuzzyFactory} = require('./fuzzyCSGFactory')
const {EPS} = require('./constants')
const Side = require('./math/Side')

const fuzzyCAGFactory = function () {
  this.vertexfactory = new fuzzyFactory(2, EPS)
}

fuzzyCAGFactory.prototype = {
  getVertex: function (sourcevertex) {
    let elements = [sourcevertex.pos._x, sourcevertex.pos._y]
    let result = this.vertexfactory.lookupOrCreate(elements, function (els) {
      return sourcevertex
    })
    return result
  },

  getSide: function (sourceside) {
    let vertex0 = this.getVertex(sourceside.vertex0)
    let vertex1 = this.getVertex(sourceside.vertex1)
    return new Side(vertex0, vertex1)
  },

  getCAG: function (sourcecag) {
    let _this = this
    let newsides = sourcecag.sides.map(function (side) {
      return _this.getSide(side)
    })
        // remove bad sides (mostly a user input issue)
        .filter(function (side) {
          return side.length() > EPS
        })
    return fromSides(newsides)
  }
}

module.exports = fuzzyCAGFactory
