import { Includeable } from 'sequelize';
import { IFields } from './interfaces';
import { TQueryIncludes } from './types';
/**
 * INCLUDE-BUILDER
 * @param queryIncludes {TQueryIncludes}
 * @param includes {object}
 * @param defaultIncludes {string[]?}
 * @return {(string | object)[]}
 */
export default function (queryIncludes: TQueryIncludes, includes: IFields, defaultIncludes?: string[]): Includeable[];
