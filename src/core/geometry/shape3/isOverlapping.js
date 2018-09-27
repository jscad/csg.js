/** returns true if there is a possibility that the two solids overlap
   * returns false if we can be sure that they do not overlap
   * NOTE: this is critical as it is used in UNIONs
   * @param  {CSG} csg
   */
const isOverlapping = function (otherCsg, csg) {
  if ((otherCsg.polygons.length === 0) || (csg.polygons.length === 0)) {
    return false
  } else {
    let mybounds = bounds(otherCsg)
    let otherbounds = bounds(csg)
    if (mybounds[1].x < otherbounds[0].x) return false
    if (mybounds[0].x > otherbounds[1].x) return false
    if (mybounds[1].y < otherbounds[0].y) return false
    if (mybounds[0].y > otherbounds[1].y) return false
    if (mybounds[1].z < otherbounds[0].z) return false
    if (mybounds[0].z > otherbounds[1].z) return false
    return true
  }
}

module.exports = isOverlapping
