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
  SuccessAndFailureResult,
  Result,
  failure,
  success,
} from './result'
export { all, allSettled } from './collection'
