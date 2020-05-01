import { ResultTuple } from './types'

export type Result<T = unknown, E = Error> = SuccessResult<T> | FailureResult<E>
export type AsyncResult<T = unknown, E = Error> = Promise<Result<T, E>>

export interface ResultType {
  readonly result: unknown
  unwrap(): ResultTuple<unknown, unknown>
  success: boolean
  failure: boolean
}

export class SuccessResult<T = unknown> implements ResultType {
  public readonly result: T

  constructor(data: T) {
    this.result = data
  }

  public unwrap(): ResultTuple<T, undefined> {
    return [this.result, undefined]
  }

  public get success(): true {
    return true
  }

  public get failure(): false {
    return false
  }
}

export class FailureResult<E = Error> implements ResultType {
  public readonly result: E

  constructor(error: E) {
    this.result = error
  }

  public unwrap(): ResultTuple<undefined, E> {
    return [undefined, this.result]
  }

  public get success(): false {
    return false
  }

  public get failure(): true {
    return true
  }
}

export function success<T>(result: T): SuccessResult<T> {
  return new SuccessResult(result)
}

export function failure<E = Error>(error: E): FailureResult<E> {
  return new FailureResult(error)
}
