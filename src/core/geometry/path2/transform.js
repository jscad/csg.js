const fromPoints = require('./fromPoints')
const vec2 = require('../../math/vec2')

// Eager transform.

const transform = (matrix, path) => {
  return fromPoints({ closed: this.closed },
                    ...path.points.map(point => vec2.transform(matrix, point)));
}

module.exports = transform
