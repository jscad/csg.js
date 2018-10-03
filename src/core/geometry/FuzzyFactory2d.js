const FuzzyFactory = require('./FuzzyFactory')
const { EPS } = require('../constants')

const FuzzyShape2Factory = function () {
  this.vertexfactory = new FuzzyFactory(2, EPS)
}

FuzzyShape2Factory.prototype = {
  getVertex: function (sourcevertex) {
    let elements = [sourcevertex[0], sourcevertex[1]]
    let result = this.vertexfactory.lookupOrCreate(elements, function (els) {
      return sourcevertex
    })
    return result
  },

  getSide: function (sourceside) {
    let vertex0 = this.getVertex(sourceside[0])
    let vertex1 = this.getVertex(sourceside[0])
    return [vertex0, vertex1]
  }
}

module.exports = FuzzyShape2Factory
