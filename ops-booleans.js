const { CAG } = require('@jscad/csg')

// -- 3D operations (OpenSCAD like notion)
// FIXME should this be lazy ? in which case, how do we deal with 2D/3D combined
// TODO we should have an option to set behaviour as first parameter
function union () {
  let options = {}
  const defaults = {
    extrude2d: false
  }
  var o, i = 0, a = arguments
  if (a[0].length) a = a[0]
  if ('extrude2d' in a[0]) { // first parameter is options
    options = Object.assign({}, defaults, a[0])
    o = a[i++]
  }

  o = a[i++]

  // TODO: add option to be able to set this?
  if ((typeof (a[i]) === 'object') && a[i] instanceof CAG && options.extrude2d) {
    o = a[i].extrude({offset: [0, 0, 0.1]}) // -- convert a 2D shape to a thin solid, note: do not a[i] = a[i].extrude()
  }
  for (; i < a.length; i++) {
    var obj = a[i]

    if ((typeof (a[i]) === 'object') && a[i] instanceof CAG && options.extrude2d) {
      obj = a[i].extrude({offset: [0, 0, 0.1]}) // -- convert a 2D shape to a thin solid:
    }
    o = o.union(obj)
  }
  return o
}

function difference () {
  var o, i = 0, a = arguments
  if (a[0].length) a = a[0]
  for (o = a[i++]; i < a.length; i++) {
    if (a[i] instanceof CAG) {
      o = o.subtract(a[i])
    } else {
      o = o.subtract(a[i].setColor(1, 1, 0)) // -- color the cuts
    }
  }
  return o
}

function intersection () {
  var o, i = 0, a = arguments
  if (a[0].length) a = a[0]
  for (o = a[i++]; i < a.length; i++) {
    if (a[i] instanceof CAG) {
      o = o.intersect(a[i])
    } else {
      o = o.intersect(a[i].setColor(1, 1, 0)) // -- color the cuts
    }
  }
  return o
}

module.exports = {
  union,
  difference,
  intersection
}
