const toString = (vec) => {
  // TODO: Where does the magic number 7 come from?
  return `[${vec[0].toFixed(7)}, ${vec[1].toFixed(7)}, ${vec[2].toFixed(7)}]`
}

module.exports = toString
