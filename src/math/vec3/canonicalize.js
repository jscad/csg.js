const fromValues = require('./fromValues');
const quantizeForSpace = require('../utils/quantizeForSpace')

const canonicalize = (vector) => {
  if (vector.length == 2) {
    return fromValues(quantizeForSpace(vector[0]),
                      quantizeForSpace(vector[1]),
                      0)
  } else {
    return fromValues(quantizeForSpace(vector[0]),
                      quantizeForSpace(vector[1]),
                      quantizeForSpace(vector[2]))
  }
}

module.exports = canonicalize
