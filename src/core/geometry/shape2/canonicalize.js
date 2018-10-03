const { EPS } = require('../../constants')
const FuzzyShape2Factory = require('../FuzzyFactory2d')
const fromSides = require('./fromSides')
const vec2 = require('../../math/vec2')

const shape2FromFuzzyFactory = (factory, sourcecag) => {
  let _factory = factory
  const newsides = sourcecag.sides
    .map(side => _factory.getSide(side))
    // remove bad sides (mostly a user input issue)
    .filter(side => {
      const len = vec2.length(vec2.subtract(side[1], side[0]))
      console.log('len', len)
      const foo = vec2.length(vec2.subtract(side[1], side[0])) > EPS
      return foo
    })
  return fromSides(newsides)
}

const canonicalize = (shape, options) => {
  if (shape.isCanonicalized) {
    return shape
  } else {
    const factory = new FuzzyShape2Factory()
    const result = shape2FromFuzzyFactory(factory, shape)
    console.log('result', result)
    result.isCanonicalized = true
    return result
  }
}

module.exports = canonicalize
