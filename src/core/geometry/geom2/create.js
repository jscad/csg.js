/** creates an 'empty'/ default 2d geometry Geom2
 * Geom2s are just nested arrays of [start, end] points:
 * [
 *  [side1Startx, side1Starty], [side1EndX, side1EndY],
 *  [side2Startx, side2Starty], [side2EndX, side2EndY],
 *  [side3Startx, side3Starty], [side3EndX, side3EndY]
 *  ...
 * ]
 * @returns Geom2
 */
const create = () => {
  return {
    sides: [], // not sure if sides or curves will be kept (either or)
    isCanonicalized: false
  }
}

module.exports = create
