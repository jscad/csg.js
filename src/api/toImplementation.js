const registerImplementation = require('./registerImplementation')

/**
 * Returns the module implementing a geometry based on a field named
 *   __jscadTag__.
 *
 * This function is functionally sound, and will always produce the same module
 * for the same tag.
 *
 * For this reason it implicitly register the nullModule if no module has been
 *   registered.
 *
 * @params {geometry} geometry - the geometry to find the implementation of.
 * @returns {Object} module - the module implementing the geometry.
 * @example
 * implementationOf(box).eachPoint({}, collectBounds, box)
 */

// 
const nullModule = {}

const toImplementation = geometry => registerImplementation(geometry.__jscadTag__, nullModule)

module.exports = toImplementation
