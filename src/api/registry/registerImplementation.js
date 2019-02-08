/**
 * Registers an implementation with a tag for use with implementationOf.
 *
 * This function is functionally sound -- the result is invariant for any
 *   provided (tag, module) pair.
 *
 * The caller can test the result of the function against the module provided
 *   to see what registerImplementation will always return when provided
 *   that tag.
 *
 * @params {string} tag - tag associated with the module.
 * @params {Object} module - the module to test the association of with the tag.
 * @example
 * (registerImplementation('foo', bar) === bar
 */
 
// The global registry.
const implementationRegistry = {}

const registerImplementation = (tag, module) => {
  const registeredModule = implementationRegistry[tag];
  if (registeredModule === undefined) {
    implementationRegistry[tag] = module
  }

  // Caller can check if the module returned matches the module passed.
  return implementationRegistry[tag]
}

module.exports = registerImplementation
