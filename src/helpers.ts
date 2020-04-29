import { Result, SuccessResult, FailureResult } from './result'

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
