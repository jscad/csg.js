const shape2 = require('../../core/geometry/shape2')
const vec2 = require('../../core/math/vec2')

/**
 * Using a CNC router it's impossible to cut out a true sharp inside corner. The inside corner
 * will be rounded due to the radius of the cutter. This function compensates for this by creating
 * an extra cutout at each inner corner so that the actual cut out shape will be at least as large
 * as needed.
 *
 * @param {Object} [options] - options for construction
 * @param {Number} [options.cutterRadius] - radius of CNC cutter
 * @param {Number} [options.acuteAngle] - angle of acute corners
 * @param {Integer} [options.cutoutSegments] - number of segments for cutouts (circles)
 * @param {shape2} shape - base 2D shape of which cutouts are applied
 * @returns {shape2} a new 2D shape with cutouts applied
 *
 * @example
 * let newshape = overCutInsideCorners({cutterRadius: 0.25}, shape);
 */
const overCutInsideCorners = (params, shape) => {
  const defaults = {
    cutterRadius: 0.25,
    acuteAngle: 150,
    cutoutSegments: 32
  }
  params = Object.assign({}, defaults, params)
  let { cutterRadius, acuteAngle, cutoutSegments } = params

  // calculate some constants
  acuteAngle = acuteAngle * 0.017453292519943295 // convert to radians
  const cutoutradius = cutterRadius / (Math.cos(cutoutSegments / 180 * Math.PI / 2))

  // get a list of outlines (points) from the shape
  const outlines = shape2.outlineToPaths(shape)
  if (outlines.length > 1) {
    throw new Error('shapes with holes are not supported')
  }

console.log('***** start overcut')

  // create a cutout which is reused below
  // TBD const cutout = circle({center: [0, 0], radius: cutoutradius, resolution: cutoutSegments})

  // create a list of cutouts (holes) positioned at each acute inside corner
  let cutouts = []
  outlines.forEach((outline) => {
    for (let i = 0; i < outline.length; i++) {
      let j = (i+1) % outline.length
      let k = (i+2) % outline.length
//console.log(i+','+j+','+k)
      let p0 = outline[i]
//console.log('a: '+p0)
      let p1 = outline[j]
//console.log('b: '+p1)
      let p2 = outline[k]
//console.log('c: '+p2)

      // calculate the angle of the corner
      let a = Math.pow(p1[0] - p0[0], 2) + Math.pow(p1[1] - p0[1], 2)
//console.log('a: '+a)
      let b = Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2)
//console.log('b: '+b)
      let c = Math.pow(p2[0] - p0[0], 2) + Math.pow(p2[1] - p0[1], 2)
//console.log('c: '+c)
      let d = (a+b-c) / Math.sqrt(4*a*b)
//console.log('d: '+d)
      let ang = Math.acos(d)
//console.log('ang: '+(ang*57.29577951308232))
      if ((d < 0) && (ang < acuteAngle)) {
//console.log('cutout at: '+p1)
        // calculate vector of the midpoint (angle)
        let v1 = vec2.normalize(vec2.subtract(p1, p0))
//console.log('v1: '+v1)
        let v2 = vec2.normalize(vec2.subtract(p2, p1))
//console.log('v2: '+v2)
        let v3 = vec2.normalize(vec2.subtract(v2, v1))
//console.log('v3: '+v3)
        // create a cutout for this cutter
//console.log(cutoutradius)
        let center = vec2.add(vec2.scale(cutoutradius, v3), p1)
//console.log('center at: '+center)
        let newcutout = {center: center, radius: cutoutradius}
        // translate the cutout and add to the list
        // TBD let newcutout = shape2.translate(center, cutout)
        cutouts.push(newcutout)
      }
    }
  })
  // DEBUG
  console.log('***** cutouts')
  cutouts.forEach((cutout) => {
    console.log('cutout: '+cutout.center+', '+cutout.radius)
  })
  if (cutouts.length > 0) {
    // remove the cutouts from the shape
    // TBD return shape.subtract(cutouts)
  }
  return shape
}

const createCutout = (center, radius) => {
}

module.exports = overCutInsideCorners
