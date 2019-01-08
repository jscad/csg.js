const getTransformationToFlatLying = function (csg) {
  let result = csg.getTransformationAndInverseTransformationToFlatLying()
  return result[0]
}

module.exports = {getTransformationToFlatLying}
