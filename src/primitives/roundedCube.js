/** Construct an axis-aligned solid rounded cuboid.
 * @param {Object} [options] - options for construction
 * @param {Vector3} [options.center=[0,0,0]] - center of rounded cube
 * @param {Vector3} [options.radius=[1,1,1]] - radius of rounded cube, single scalar is possible
 * @param {Number} [options.roundradius=0.2] - radius of rounded edges
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cube = CSG.roundedCube({
 *   center: [2, 0, 2],
 *   radius: 15,
 *   roundradius: 2,
 *   resolution: 36,
 * });
 */
const roundedCube = function (options) {

  let minRR = 1e-2 // minroundradius 1e-3 gives rounding errors already
  let center
  let cuberadius
  let corner1
  let corner2
  options = options || {}
  center = parseOptionAs3DVector(options, 'center', [0, 0, 0])
  cuberadius = parseOptionAs3DVector(options, 'radius', [1, 1, 1])
  cuberadius = cuberadius.abs() // negative radii make no sense
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)
  if (resolution < 4) resolution = 4
  if (resolution % 2 === 1 && resolution < 8) resolution = 8 // avoid ugly
  let roundradius = parseOptionAs3DVector(options, 'roundradius', [0.2, 0.2, 0.2])
  // slight hack for now - total radius stays ok
  roundradius = new Vector3(Math.max(roundradius.x, minRR), Math.max(roundradius.y, minRR), Math.max(roundradius.z, minRR))
  let innerradius = cuberadius.minus(roundradius)
  if (innerradius.x < 0 || innerradius.y < 0 || innerradius.z < 0) {
    throw new Error('roundradius <= radius!')
  }
  let res = sphere({radius: 1, resolution: resolution})
  res = res.scale(roundradius)
  innerradius.x > EPS && (res = res.stretchAtPlane([1, 0, 0], [0, 0, 0], 2 * innerradius.x))
  innerradius.y > EPS && (res = res.stretchAtPlane([0, 1, 0], [0, 0, 0], 2 * innerradius.y))
  innerradius.z > EPS && (res = res.stretchAtPlane([0, 0, 1], [0, 0, 0], 2 * innerradius.z))
  res = res.translate([-innerradius.x + center.x, -innerradius.y + center.y, -innerradius.z + center.z])
  res = res.reTesselated()

  return res
}

module.exports = roundedCube
