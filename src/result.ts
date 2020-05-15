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
export interface ResultType<T, E> {
  /** The value */
  readonly result: T

  /** The error */
  readonly error: E

  /**
   * Returns a tuple with `[successValue, failureValue]`
   */
  unwrap(): [T, E]

  /** Returns `true` if a success result, `false` otherwise` */
  success: boolean

  /** Returns `true` if an error result, `false` otherwise */
  failure: boolean
}

/**
 * A class representing a successful result
 */
export class SuccessResult<T = unknown> implements ResultType<T, undefined> {
  private _res: T

  constructor(data: T) {
    this._res = data
  }

  public get result(): T {
    return this._res
  }

  public get error(): undefined {
    return undefined
  }

  /** Returns a tuple with `[successValue, undefined]` */
  public unwrap(): [T, undefined] {
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
export class FailureResult<E = Error> implements ResultType<undefined, E> {
  private _res: E

  constructor(error: E) {
    this._res = error
  }

  public get result(): undefined {
    return undefined
  }

  public get error(): E {
    return this._res
  }

  /** Returns a tuple with `[undefined, failureValue]` */
  public unwrap(): [undefined, E] {
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
export class SuccessAndFailureResult<T, E = Error> implements ResultType<T, E> {
  private _res: T
  private _err: E

  constructor(res: T, err: E) {
    this._res = res
    this._err = err
  }

  public get result(): T {
    return this._res
  }

  public get error(): E {
    return this._err
  }

  public unwrap(): [T, E] {
    return [this._res, this._err]
  }

  public get success(): boolean {
    return isUndefinedOrNull(this._res)
      ? false
      : Array.isArray(this._res)
      ? this._res.length > 0
      : true
  }

  public get failure(): boolean {
    return isUndefinedOrNull(this._err)
      ? false
      : Array.isArray(this._err)
      ? this._err.length > 0
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
