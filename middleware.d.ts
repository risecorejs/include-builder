import express from 'express';
/**
 * MIDDLEWARE
 * @return {express.Handler}
 */
export default function (): express.Handler;
declare global {
    namespace Express {
        interface Request {
            includeBuilder(includes: object, defaultIncludes: string[]): any[];
        }
    }
}
