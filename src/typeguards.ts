/**
 * This package includes various typeguards
 * @packageDocumentation
 */

import { Result, SuccessResult, FailureResult } from './result'
import { Collection, SuccessCollection, FailureCollection } from './collection'

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

/**
 * Check if `o` is a [[Collection]]
 * @param o
 */
export function isCollection(o: unknown): o is Collection {
  return typeof o === 'object' && o instanceof Collection
}

/**
 * Check if `o` is a [[SuccessCollection]]
 * @param o
 */
export function isSuccessCollection(
  o: unknown
): o is SuccessCollection<SuccessResult> {
  return typeof o === 'object' && o instanceof SuccessCollection
}

/**
 * Check if `o` is a [[FailureCollection]]
 * @param o
 */
export function isFailureCollection(
  o: unknown
): o is FailureCollection<FailureResult> {
  return typeof o === 'object' && o instanceof FailureCollection
}
