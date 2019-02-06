const normalizePoint = point => {
  switch (point.length) {
    case 2: return [point[0], point[1], 0]
    case 3: return point
    default: throw new Error('Only 2 and 3 dimensional points are supported')
  }
}

module.exports = normalizePoint
