/**
 * Types.ts
 * @author HU JIAJUN <e0556371@u.nus.edu>
 * @file Common type patterns
 * @barrel export all
 */

/**
 * Extract from T those types that are strictly assignable to U
 */
export type ExtractStrict<T, U extends T> = Extract<T, U>;
