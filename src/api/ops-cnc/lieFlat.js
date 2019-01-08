const lieFlat = function (csg) {
  let transformation = csg.getTransformationToFlatLying()
  return csg.transform(transformation)
}

module.exports = {lieFlat}
