import express from 'express'
import { Includeable } from 'sequelize'

import { TQueryIncludes } from './types'

import includeBuilder from './index'

/**
 * MIDDLEWARE
 * @return {express.Handler}
 */
export default function (): express.Handler {
  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    req.includeBuilder = (includes: object, defaultIncludes?: string[]): Includeable[] => {
      return includeBuilder(<TQueryIncludes>req.query.includes, includes, defaultIncludes)
    }

    next()
  }
}

declare global {
  namespace Express {
    export interface Request {
      includeBuilder(includes: object, defaultIncludes?: string[]): Includeable[]
    }
  }
}
