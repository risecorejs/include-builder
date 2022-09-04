namespace Express {
  export interface Request {
    includeBuilder(includes: object, defaultIncludes: string[]): any[]
  }
}
