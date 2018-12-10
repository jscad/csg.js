/**
 * Represents a unbounded line in 2D space, centered about an origin.
 * A line is parametrized by its normal vector (perpendicular to the line, rotated 90 degrees counter clockwise)
 * and w. The line passes through the point <normal>.times(w).
 * Equation: p is on line if normal.dot(p)==w
 * @param {Vector2D} normal normal must be a unit vector!
 * @returns {Line2D}
*/

/**
 * Creates a new 2D line, mirroring the X axis.
 *
 * @returns {line2} a new 2D line
 */
const create = () => {
  const out = new Float32Array(3)
  out[0] = 0
  out[1] = 0
  out[2] = 0
  return out
}
