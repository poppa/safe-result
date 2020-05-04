/**
 * This package includes various typeguards
 * @packageDocumentation
 */

import { Result, SuccessResult, FailureResult } from './result'

/**
 * Check if `o` is a [[Result]]
 * @param o
 */
export function isResult(o: unknown): o is Result {
  return (
    typeof o === 'object' &&
    (o instanceof SuccessResult || o instanceof FailureResult)
  )
}

/**
 * Check if `o` is a [[SuccessResult]]
 * @param o
 */
export function isSuccess(o: unknown): o is SuccessResult {
  return typeof o === 'object' && o instanceof SuccessResult
}

/**
 * Check if `o` is a [[FailureResult]]
 * @param o
 */
export function isFailure(o: unknown): o is FailureResult {
  return typeof o === 'object' && o instanceof FailureResult
}
