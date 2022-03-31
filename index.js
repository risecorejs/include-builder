const flat = require('flat')
const _ = require('lodash')

/**
 * INCLUDE-BUILDER
 * @param queryInclude {string[]}
 * @param aliases {Object}
 * @param defaultInclude {array?}
 * @return {Array}
 */
module.exports = (queryInclude, aliases, defaultInclude = []) => {
  const flatQueryInclude = {}

  queryInclude = queryInclude ? [...new Set(queryInclude.concat(defaultInclude))] : defaultInclude

  queryInclude.sort((a, b) => {
    if (a < b) return -1
    if (a > b) return 1

    return 0
  })

  for (const key of queryInclude) {
    flatQueryInclude[key] = {}
  }

  const unFlatQueryInclude = flat.unflatten(flatQueryInclude)

  const include = []

  for (const [key, value] of Object.entries(unFlatQueryInclude)) {
    if (_.isEmpty(value)) {
      include.push(aliases[key])
    } else {
      include.push(recursive(value, aliases, key, aliases[key]))
    }
  }

  return include
}

/**
 * RECURSIVE
 * @param unFlatQueryInclude {Object}
 * @param aliases {Object}
 * @param prevKey {string}
 * @param prevInclude {Object}
 * @return {Object}
 */
function recursive(unFlatQueryInclude, aliases, prevKey, prevInclude) {
  for (const [key, value] of Object.entries(unFlatQueryInclude)) {
    if (_.isEmpty(value)) {
      if (prevInclude.include) {
        prevInclude.include.push(aliases[prevKey + '.' + key])
      } else {
        prevInclude.include = [aliases[prevKey + '.' + key]]
      }
    } else {
      const _key = prevKey ? prevKey + '.' + key : key

      if (prevInclude.include) {
        prevInclude.include.push(recursive(unFlatQueryInclude[key], aliases, _key, aliases[_key]))
      } else {
        prevInclude.include = [recursive(unFlatQueryInclude[key], aliases, _key, aliases[_key])]
      }
    }
  }

  return prevInclude
}
