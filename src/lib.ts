/**
 * This module just re-exports stuff
 * @packageDocumentation
 * @internal
 */

export * from './types'
export * from './typeguards'
export {
  AsyncResult,
  FailureResult,
  SuccessResult,
  Result,
  failure,
  success,
} from './result'
export {
  Collection,
  SuccessCollection,
  FailureCollection,
  all,
  allSetteled,
  collection,
  failureCollection,
  successCollection,
} from './collection'
