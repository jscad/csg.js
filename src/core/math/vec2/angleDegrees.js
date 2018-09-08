module.exports = angleDegrees

const angleRadians = require('./angleRadians')

const {radToDeg} = require('../utils.js')

function angleDegrees (vector) {
  return radToDeg(angleRadians(vector))
}
