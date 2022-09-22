"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flat_1 = __importDefault(require("flat"));
const lodash_1 = __importDefault(require("lodash"));
/**
 * INCLUDE-BUILDER
 * @param queryIncludes {TQueryIncludes}
 * @param includes {IFields}
 * @param defaultIncludes {string[]?}
 * @return {(string | object)[]}
 */
function default_1(queryIncludes, includes, defaultIncludes) {
    defaultIncludes ||= [];
    const includeList = [];
    if (queryIncludes?.length) {
        if (!Array.isArray(queryIncludes)) {
            queryIncludes = [queryIncludes];
        }
        includeList.push(...new Set(queryIncludes.concat(defaultIncludes)));
    }
    else {
        includeList.push(...defaultIncludes);
    }
    includeList.sort((a, b) => {
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    });
    const flatIncludeList = {};
    for (const key of includeList) {
        flatIncludeList[key] = {};
    }
    const unFlatIncludeList = flat_1.default.unflatten(flatIncludeList);
    const include = [];
    for (const [key, value] of Object.entries(unFlatIncludeList)) {
        if (lodash_1.default.isEmpty(value)) {
            include.push(includes[key]);
        }
        else {
            include.push(recursive(value, includes, key, includes[key]));
        }
    }
    return include;
}
exports.default = default_1;
/**
 * RECURSIVE
 * @param unFlatIncludeList {IFields}
 * @param includes {IFields}
 * @param prevKey {string}
 * @param prevInclude {IFields}
 * @return {object}
 */
function recursive(unFlatIncludeList, includes, prevKey, prevInclude) {
    for (const [key, value] of Object.entries(unFlatIncludeList)) {
        if (lodash_1.default.isEmpty(value)) {
            if (prevInclude.include) {
                prevInclude.include.push(includes[prevKey + '.' + key]);
            }
            else {
                prevInclude.include = [includes[prevKey + '.' + key]];
            }
        }
        else {
            const _key = prevKey ? prevKey + '.' + key : key;
            if (prevInclude.include) {
                prevInclude.include.push(recursive(unFlatIncludeList[key], includes, _key, includes[_key]));
            }
            else {
                prevInclude.include = [recursive(unFlatIncludeList[key], includes, _key, includes[_key])];
            }
        }
    }
    return prevInclude;
}
