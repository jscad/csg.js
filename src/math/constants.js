/** The resolution of space, currently one hundred nanometers.
 *  This should be 1 / EPS.
 * @default
 */
const spatialResolution = 1e5

/** Epsilon used during determination of near zero distances.
 *  This should be 1 / spacialResolution.
 * @default
 */
const EPS = 1e-5

// Ranks
const X = 0
const Y = 1
const Z = 2
const W = 3

module.exports = {
  EPS,
  spatialResolution,
  X,
  Y,
  Z,
  W
}
