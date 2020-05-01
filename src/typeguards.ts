import { Result, SuccessResult, FailureResult } from './result'
import { Collection, SuccessCollection, FailureCollection } from './collection'

export function isResult(o: unknown): o is Result {
  return (
    typeof o === 'object' &&
    (o instanceof SuccessResult || o instanceof FailureResult)
  )
}

export function isSuccess(o: unknown): o is SuccessResult {
  return typeof o === 'object' && o instanceof SuccessResult
}

export function isFailure(o: unknown): o is FailureResult {
  return typeof o === 'object' && o instanceof FailureResult
}

export function isCollection(o: unknown): o is Collection {
  return typeof o === 'object' && o instanceof Collection
}

export function isSuccessCollection(
  o: unknown
): o is SuccessCollection<SuccessResult[]> {
  return typeof o === 'object' && o instanceof SuccessCollection
}

export function isFailureCollection(
  o: unknown
): o is FailureCollection<FailureResult[]> {
  return typeof o === 'object' && o instanceof FailureResult
}
