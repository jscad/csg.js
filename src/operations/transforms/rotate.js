const flatten = require('../utils/flatten')

const mat4 = require('../../math/mat4')

const {geom2, geom3, path2} = require('../../geometry')

// Tait-Bryan Euler angle convention using active, intrinsic rotations around the axes in the order z-y-x
// angle of rotations
//   yaw/Z rotation
//   pitch/Y rotation
//   roll/X rotation
const rotation = (yaw, pitch, roll) => {
  // convert to radians
  yaw = yaw * Math.PI * (1.0 / 180.0)
  pitch = pitch * Math.PI * (1.0 / 180.0)
  roll = roll * Math.PI * (1.0 / 180.0)

  // precompute sines and cosines of Euler angles
  const sy = Math.sin(yaw);
  const cy = Math.cos(yaw);
  const sp = Math.sin(pitch);
  const cp = Math.cos(pitch);
  const sr = Math.sin(roll);
  const cr = Math.cos(roll);

  // create and populate rotation matrix
  // clockwise rotation
  //const els = [
  //  cp*cy, sr*sp*cy - cr*sy, sr*sy + cr*sp*cy, 0,
  //  cp*sy, cr*cy + sr*sp*sy, cr*sp*sy - sr*cy, 0,
  //  -sp, sr*cp, cr*cp, 0,
  //  0, 0, 0, 1
  //]
  // counter clockwise rotation
  const els = [
    cp*cy, cp*sy, -sp, 0,
    sr*sp*cy - cr*sy, cr*cy + sr*sp*sy, sr*cp, 0,
    sr*sy + cr*sp*cy, cr*sp*sy - sr*cy, cr*cp, 0,
    0, 0, 0, 1
  ]
  return mat4.clone(els)
}

/**
 * Rotate the given object(s) using the given options (if any)
 * @see The paper by D. Rose, Rotations in Three-Dimensions (Tait-Bryan euler angles)
 * @param {Object} options - options for rotate
 * @param {Array} angles - angle of rotations about X, Y, and X axis
 * @param {Object|Array} objects - the objects(s) to rotate
 * @return {Object|Array} the rotated object(s)
 *
 * @example
 * const newsphere = rotate({angles: [45,0,0]}, sphere())
 */
const rotate = (angles, ...objects) => {
  if (!Array.isArray(angles)) throw new Error('angles must be an array')
  if (angles.length != 3) throw new Error('angles must contain X, Y and Y values')

  objects = flatten(objects)
  if (objects.length === 0) throw new Error('wrong number of arguments')

  const matrix = rotation(angles[2], angles[1], angles[0])

  const results = objects.map((object) => {
    if (path2.isA(object)) return path2.transform(matrix, object)
    if (geom2.isA(object)) return geom2.transform(matrix, object)
    if (geom3.isA(object)) return geom3.transform(matrix, object)
    return object
  })
  return results.length === 1 ? results[0] : results
}

const rotateX = (angle, ...objects) => rotate([angle, 0, 0], objects)

const rotateY = (angle, ...objects) => rotate([0, angle, 0], objects)

const rotateZ = (angle, ...objects) => rotate([0, 0, angle], objects)

module.exports = {
  rotate,
  rotateX,
  rotateY,
  rotateZ
}
