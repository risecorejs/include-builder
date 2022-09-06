import express from 'express'

import { TQueryIncludes } from './types'

import includeBuilder from './index'

/**
 * MIDDLEWARE
 * @return {express.Handler}
 */
export default function (): express.Handler {
  return function (req: express.Request, res: express.Response, next: express.NextFunction) {
    req.includeBuilder = (includes: object, defaultIncludes?: string[]) => {
      return includeBuilder(<TQueryIncludes>req.query.includes, includes, defaultIncludes)
    }

    next()
  }
}

declare global {
  namespace Express {
    interface Request {
      includeBuilder(includes: object, defaultIncludes: string[]): any[]
    }
  }
}
