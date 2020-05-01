/**
 * @packageDocumentation
 * @internal
 * Internal module
 */

/**
 * @internal
 * Check if `o` is a Promise or not
 */
export function isPromise(o: unknown): o is Promise<unknown> {
  return typeof o === 'object' && o !== null && 'then' in o && 'catch' in o
}

/**
 * @internal
 * Check if `e` in an Error instance
 */
export function isError(e: unknown): e is Error {
  return typeof e === 'object' && e instanceof Error
}
