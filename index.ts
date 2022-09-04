import flat from 'flat'
import _ from 'lodash'

import { IFields } from './interfaces'
import { TQueryIncludes } from './types'

/**
 * INCLUDE-BUILDER
 * @param queryIncludes {TQueryIncludes}
 * @param includes {object}
 * @param defaultIncludes {string[]?}
 * @return {any[]}
 */
export default function (
  queryIncludes: TQueryIncludes,
  includes: IFields,
  defaultIncludes?: string[]
): (string | object)[] {
  defaultIncludes ||= []

  const includeList: string[] = []

  if (queryIncludes?.length) {
    if (!Array.isArray(queryIncludes)) {
      queryIncludes = [queryIncludes]
    }

    includeList.push(...new Set(queryIncludes.concat(defaultIncludes)))
  } else {
    includeList.push(...defaultIncludes)
  }

  includeList.sort((a: string, b: string) => {
    if (a < b) return -1
    if (a > b) return 1

    return 0
  })

  const flatIncludeList: IFields = {}

  for (const key of includeList) {
    flatIncludeList[key] = {}
  }

  const unFlatIncludeList: IFields = flat.unflatten(flatIncludeList)

  const include: (string | object)[] = []

  for (const [key, value] of Object.entries(unFlatIncludeList)) {
    if (_.isEmpty(value)) {
      include.push(includes[key])
    } else {
      include.push(recursive(value, includes, key, includes[key]))
    }
  }

  return include
}

/**
 * RECURSIVE
 * @param unFlatIncludeList {IFields}
 * @param includes {IFields}
 * @param prevKey {string}
 * @param prevInclude {IFields}
 * @return {object}
 */
function recursive(unFlatIncludeList: IFields, includes: IFields, prevKey: string, prevInclude: IFields): object {
  for (const [key, value] of Object.entries(unFlatIncludeList)) {
    if (_.isEmpty(value)) {
      if (prevInclude.include) {
        prevInclude.include.push(includes[prevKey + '.' + key])
      } else {
        prevInclude.include = [includes[prevKey + '.' + key]]
      }
    } else {
      const _key = prevKey ? prevKey + '.' + key : key

      if (prevInclude.include) {
        prevInclude.include.push(recursive(unFlatIncludeList[key], includes, _key, includes[_key]))
      } else {
        prevInclude.include = [recursive(unFlatIncludeList[key], includes, _key, includes[_key])]
      }
    }
  }

  return prevInclude
}
