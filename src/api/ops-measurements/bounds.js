const cagMeasurements = require('../../core/utils/cagMeasurements')
const csgMeasurements = require('../../core/utils/csgMeasurements')

const {isCAG} = require('../../core/utils')

const bounds = input => {
  return isCAG(input) ? cagMeasurements.getBounds(input) : csgMeasurements.bounds(input)
}

module.exports = bounds
