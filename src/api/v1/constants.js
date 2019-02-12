/** Number of polygons per 360 degree revolution for 2D objects.
 * @default
 */
const defaultResolution2D = 32
/** Number of polygons per 360 degree revolution for 3D objects.
 * @default
 */
const defaultResolution3D = 12

/** Epsilon used during determination of near zero distances.
 * @default
 */
const EPS = 1e-5

/** Epsilon used during determination of near zero areas.
 * @default
 */
const angleEPS = 0.10

/** Epsilon used during determination of near zero areas.
 *  This is the minimal area of a minimal polygon.
 * @default
 */
const areaEPS = 0.50 * EPS * EPS * Math.sin(angleEPS)

const X = 0
const Y = 1
const Z = 2
const W = 3

module.exports = {
  defaultResolution2D,
  defaultResolution3D,
  EPS,
  angleEPS,
  areaEPS,
  X,
  Y,
  Z,
  W
}
