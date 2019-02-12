/**
 * Returns the module associated with the __jscadTag__ field value of the
 * object passed, registering a module none exists.
 *
 * If no module is provided, it will default to an empty nullModule.
 *
 * This function is functionally sound, and will always produce the same module
 * for the same tag.
 *
 * @params {object} object - the object to find the implementation of.
 * @params {object} [module] - the module to use if none is registered.
 * @returns {Object} module - the module implementing the geometry.
 * @example
 * call(box).eachPoint({}, collectBounds, box)
 */

// The global registry.
const registry = {}

const register = (tag, module) => {
  const registeredModule = registry[tag];
  if (registeredModule === undefined) {
    registry[tag] = module
  }

  // Caller can test success by checking if the module returned matches the
  // module passed.
  return registry[tag]
}

const nullModule = {}

const call = (object, module) => register(object.__jscadTag__, module === undefined ? nullModule : module)

module.exports = call
