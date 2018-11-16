const poly3 = require('../../poly3')

const toString = geometry => {
  return geometry.polygons.reduce((result, polygon) => {
    result += poly3.toString(polygon)
    return result
  }, 'Geom3:\n')
}

module.exports = toString
