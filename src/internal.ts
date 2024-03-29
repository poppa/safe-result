/**
 * @packageDocumentation
 * @internal
 * Internal module
 */

import type { FailureResult, SuccessResult, ValueType } from './lib'
import { failure, isFailure, isResult, isSuccess, success } from './lib'

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

/**
 * @internal
 */
export function extractValue<T>(t: T[]): Array<ValueType<T>> {
  return t.map((x) => (isResult(x) ? x.result : x)) as Array<ValueType<T>>
}

/**
 * @internal
 */
export function toSuccess<T extends SuccessResult | unknown>(
  e: T
): SuccessResult<ValueType<T>> {
  return (isSuccess(e) ? e : success(e)) as SuccessResult<ValueType<T>>
}

/**
 * @internal
 */
export function toFailure<T extends FailureResult | unknown>(
  e: T
): FailureResult<ValueType<T>> {
  return (isFailure(e) ? e : failure(e)) as FailureResult<ValueType<T>>
}

/**
 * @internal
 */
export function isUndefinedOrNull(o: unknown): o is undefined | null {
  return typeof o === 'undefined' || o === null
}
