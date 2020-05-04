import { ResultTuple } from './types'
import { isUndefinedOrNull } from './internal'
/**
 * A result that is either a [[`SuccessResult`]] or [[`FailureResult`]]
 * @typeParam T - Type of successful result
 * @typeParam E - Type of error result
 */
export type Result<T = unknown, E = Error> = SuccessResult<T> | FailureResult<E>

/**
 * Alias for `Promise<Result<T, E>>`
 * @see [[Result]]
 * @typeParam T - Type of successful result
 * @typeParam E - Type of error result
 */
export type AsyncResult<T = unknown, E = Error> = Promise<Result<T, E>>

/**
 * Result interface
 */
export interface ResultType {
  /** The value */
  readonly result: unknown

  /** The error */
  readonly error: unknown

  /**
   * Returns a tuple with `[successValue, failureValue]`
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
  public readonly error = undefined

  constructor(data: T) {
    this.result = data
  }

  /** Returns a tuple with `[successValue, undefined]` */
  public unwrap(): ResultTuple<T, undefined> {
    return [this.result, undefined]
  }

  /** Always returns `true` */
  public get success(): true {
    return true
  }

  /** Always returns `false` */
  public get failure(): false {
    return false
  }
}

/**
 * A class representing an error result
 */
export class FailureResult<E = Error> implements ResultType {
  public readonly result = undefined
  public readonly error: E

  constructor(error: E) {
    this.error = error
  }

  /** Returns a tuple with `[undefined, failureValue]` */
  public unwrap(): ResultTuple<undefined, E> {
    return [undefined, this.error]
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
 * Class representing a result that can both have successful and failed
 * values. This is only used internally by and returned from [[allSettled]]
 */
export class SuccessAndFailureResult<T, E = Error> implements ResultType {
  public readonly result: T
  public readonly error: E

  constructor(res: T, err: E) {
    this.result = res
    this.error = err
  }

  public unwrap(): ResultTuple<T, E> {
    return [this.result, this.error]
  }

  public get success(): boolean {
    return isUndefinedOrNull(this.result)
      ? false
      : Array.isArray(this.result)
      ? this.result.length > 0
      : true
  }

  public get failure(): boolean {
    return isUndefinedOrNull(this.error)
      ? false
      : Array.isArray(this.error)
      ? this.error.length > 0
      : true
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
