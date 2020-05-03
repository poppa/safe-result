import { ResultTuple } from './types'
/**
 * A result that is either a [[`SuccessResult`]] or [[`FailureResult`]]
 * @typeParam T - Type of successful result
 * @typeParam E - Type of error result
 */
export type Result<T = unknown, E = Error> = SuccessResult<T> | FailureResult<E>
/**
 * Alias for `Promise`<[[`Result`]]`<T, E>>`
 * @typeParam T - Type of successful result
 * @typeParam E - Type of error result
 */
export type AsyncResult<T = unknown, E = Error> = Promise<Result<T, E>>

// export type ExtractType<T extends Result> = T extends SuccessResult
//   ? T.result

/**
 * Result interface
 */
export interface ResultType {
  /** The value */
  readonly result: unknown
  /**
   * Returns a tuple with either `[successValue, undefined]` or
   * `[undefined, failureValue]` depending on whether the result is a
   * [[SuccessResult]] or a [[FailureResult]]
   */
  unwrap(): ResultTuple<unknown, unknown>
  /** Returns `true` if a success result, `false` otherwise` */
  success: boolean
  /** Returns `true` if an error result, `false` otherwise */
  failure: boolean
}

/**
 * A class representing a successful result
 */
export class SuccessResult<T = unknown> implements ResultType {
  public readonly result: T

  constructor(data: T) {
    this.result = data
  }

  /** @inheritdoc */
  public unwrap(): ResultTuple<T, undefined> {
    return [this.result, undefined]
  }

  /** Always return `true` */
  public get success(): true {
    return true
  }

  /** Always returns false */
  public get failure(): false {
    return false
  }
}

/**
 * A class representing an error result
 */
export class FailureResult<E = Error> implements ResultType {
  public readonly result: E

  constructor(error: E) {
    this.result = error
  }

  /** @inheritdoc */
  public unwrap(): ResultTuple<undefined, E> {
    return [undefined, this.result]
  }

  /** Always returns `false` */
  public get success(): false {
    return false
  }

  /** Always returns `true` */
  public get failure(): true {
    return true
  }
}

/**
 * Utility function for creating a [[SuccessResult]] instance
 * @param result
 */
export function success<T>(result: T): SuccessResult<T> {
  return new SuccessResult(result)
}

/**
 * Utility function for creating a [[FailureResult]] instance
 * @param error
 */
export function failure<E = Error>(error: E): FailureResult<E> {
  return new FailureResult(error)
}
