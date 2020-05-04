/**
 * This package includes various typeguards
 * @packageDocumentation
 */

import {
  Result,
  SuccessResult,
  FailureResult,
  SuccessAndFailureResult,
} from './result'

/**
 * Check if `o` is a [[Result]]
 */
export function isResult(o: unknown): o is Result {
  return (
    typeof o === 'object' &&
    (o instanceof SuccessResult || o instanceof FailureResult)
  )
}

/**
 * Check if `o` is a [[SuccessResult]]
 */
export function isSuccess(o: unknown): o is SuccessResult {
  return typeof o === 'object' && o instanceof SuccessResult
}

/**
 * Check if `o` is a [[FailureResult]]
 */
export function isFailure(o: unknown): o is FailureResult {
  return typeof o === 'object' && o instanceof FailureResult
}

/**
 * Check is `o` is a [[SuccessAndFailureResult]]
 */
export function isSuccessAndFailure(
  o: unknown
): o is SuccessAndFailureResult<unknown> {
  return typeof o === 'object' && o instanceof SuccessAndFailureResult
}
