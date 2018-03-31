function toString () {
  let result = 'CSG solid:\n'
  this.polygons.map(function (p) {
    result += p.toString()
  })
  return result
}

module.exports = toString