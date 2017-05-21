const test = require('ava')
const { cube } = require('./primitives3d')
const { square, circle } = require('./primitives2d')
const { linear_extrude, rotate_extrude, rectangular_extrude } = require('./ops-extrusions')
const { union } = require('./ops-booleans')

// any tests that involve multiple operands (extrude with union translate with difference etc)
// and are not testing a specific feature (union, difference, translate etc)
// belong here

test('linear_extrude of union of 2d shapes', t => {
  const obs = linear_extrude({height: 0.1}, union([
    circle({r: 8, center: true}).translate([0, 20, 0]),
    circle({r: 8, center: true})
  ]))

  t.deepEqual(obs.polygons.length, 142)
})
