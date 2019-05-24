/** Construct an axis-aligned solid rounded cuboid.
 * @param {Object} [options] - options for construction
 * @param {Vector3} [options.center=[0,0,0]] - center of rounded cube
 * @param {Vector3} [options.size=[1,1,1]] - size of rounded cube, single scalar is possible
 * @param {Number} [options.roundRadius=0.2] - radius of rounded edges
 * @param {Number} [options.segments=defaultResolution3D] - number of segments to create per 360 rotation
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cube = CSG.roundedCube({
 *   center: [2, 0, 2],
 *   size: 15,
 *   roundRadius: 2,
 *   segments: 36,
 * });
 */
const roundedCube = function (options) {

  let minRR = 1e-2 // minroundradius 1e-3 gives rounding errors already
  let center
  let cubesize
  let corner1
  let corner2
  options = options || {}
  center = parseOptionAs3DVector(options, 'center', [0, 0, 0])
  cubesize = parseOptionAs3DVector(options, 'size', [1, 1, 1])
  cubesize = cubesize.abs() // negative size make no sense
  let segments = parseOptionAsInt(options, 'segments', defaultResolution3D)
  if (segments < 4) segments = 4
  if (segments % 2 === 1 && segments < 8) segments = 8 // avoid ugly
  let roundRadius = parseOptionAs3DVector(options, 'roundRadius', [0.2, 0.2, 0.2])
  // slight hack for now - total size stays ok
  roundRadius = new Vector3(Math.max(roundRadius.x, minRR), Math.max(roundRadius.y, minRR), Math.max(roundRadius.z, minRR))
  let innersize = cubesize.minus(roundRadius)
  if (innersize.x < 0 || innersize.y < 0 || innersize.z < 0) {
    throw new Error('roundRadius <= size!')
  }
  let res = sphere({radius: 1, segments: segments})
  res = res.scale(roundRadius)
  innersize.x > EPS && (res = res.stretchAtPlane([1, 0, 0], [0, 0, 0], 2 * innersize.x))
  innersize.y > EPS && (res = res.stretchAtPlane([0, 1, 0], [0, 0, 0], 2 * innersize.y))
  innersize.z > EPS && (res = res.stretchAtPlane([0, 0, 1], [0, 0, 0], 2 * innersize.z))
  res = res.translate([-innersize.x + center.x, -innersize.y + center.y, -innersize.z + center.z])
  res = res.reTesselated()

  return res
}

module.exports = roundedCube
