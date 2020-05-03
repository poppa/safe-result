import {
  Result,
  success,
  failure,
  AsyncResult,
  SuccessResult,
  FailureResult,
} from './result'
import { isPromise, isError, toSuccess, toFailure } from './internal'
import { isResult, isFailure, isSuccess } from './typeguards'
import { ValueType } from './types'

/**
 * A collection that can contain both [[`SuccessResult`]]s and
 * [[`FailureResult`]]s.
 *
 * @note This extends [[Array]] so it's a proper array object
 */
export class Collection<R extends Result = Result> extends Array<R> {
  constructor(...items: R[]) {
    super(...items)
  }

  public unwrap(): Array<ValueType<R>> {
    return this.map((x) => x.result) as Array<ValueType<R>>
  }

  public unwrapAll(): Array<ValueType<R>>[] {
    return this.map((r) => r.unwrap()) as Array<ValueType<R>>[]
  }

  public get success(): boolean {
    return this.successes.length > 0
  }

  public get failure(): boolean {
    return this.failures.length > 0
  }

  public get successes(): SuccessResult[] {
    return this.filter(isSuccess) as SuccessResult[]
  }

  public get failures(): FailureResult[] {
    return this.filter(isFailure) as FailureResult[]
  }
}

/**
 * A collection only containing [[SuccessResult]]s
 */
export class SuccessCollection<R extends SuccessResult> extends Collection<R> {
  constructor(...items: R[]) {
    super(...items)
  }

  public get success(): true {
    return true
  }

  public get failure(): false {
    return false
  }

  public get successes(): R[] {
    return this.filter((s) => s.success)
  }

  public get failures(): [] {
    return []
  }
}

/**
 * A collection only containing [[FailureResult]]s
 */
export class FailureCollection<R extends FailureResult> extends Collection<R> {
  constructor(...items: R[]) {
    super(...items)
  }

  public get success(): false {
    return false
  }

  public get failure(): true {
    return true
  }

  public get successes(): [] {
    return []
  }

  public get failures(): FailureResult[] {
    return this.filter((e) => e.failure)
  }
}

// Overload signatures must all be ambient or non-ambient.ts(2384)
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
declare function guard<T, N extends true>(
  res: Array<T | Promise<T>>,
  noThrow: N
): Promise<Collection<Result<ValueType<T>>>>

// Overload signatures must all be ambient or non-ambient.ts(2384)
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
declare function guard<T, N extends false>(
  res: Array<T | Promise<T>>,
  noThrow: N
): Promise<
  | SuccessCollection<SuccessResult<ValueType<T>>>
  | FailureCollection<FailureResult>
>

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function guard<T, N extends boolean>(
  res: Array<T | Promise<T>>,
  noThrow: N
) {
  try {
    const x: AsyncResult<unknown, unknown>[] = res.map((r) => {
      if (isPromise(r)) {
        return new Promise((resolve, reject) => {
          r.then((res) => resolve(toSuccess(res))).catch((e) =>
            noThrow ? resolve(toFailure(e)) : reject(toFailure(e))
          )
        })
      } else {
        if (isResult(r)) {
          return r.success
            ? Promise.resolve(r)
            : noThrow
            ? Promise.resolve(r)
            : Promise.reject(r)
        } else {
          return isError(r)
            ? noThrow
              ? Promise.resolve(failure(r))
              : Promise.reject(failure(r))
            : Promise.resolve(success(r))
        }
      }
    })

    const resolved = (await Promise.all(x)) as Result[]

    if (noThrow) {
      return new Collection(...resolved)
    } else {
      return new SuccessCollection(...(resolved as SuccessResult[]))
    }
  } catch (e) {
    return new FailureCollection(...[isFailure(e) ? e : failure(e)])
  }
}

/**
 * Convenience method for creating an instance of [[Collection]]
 * @param res
 */
export function collection<T extends Result>(res: T[]): Collection<T> {
  return new Collection(...res)
}

/**
 * Convenience method for creating an instance of [[SuccessCollection]]
 * @param res
 */
export function successCollection<T extends SuccessResult>(
  res: T[]
): SuccessCollection<T> {
  return new SuccessCollection(...res)
}

/**
 * Convenience method for creating an instance of [[FailureCollection]]
 * @param res
 */
export function failureCollection<T extends FailureResult>(
  res: T[]
): FailureCollection<T> {
  return new FailureCollection(...res)
}

/**
 * Creates a `Promise` that resovles when all values resolves whether they
 * were rejected or not.
 *
 * This will return a [[Collection]] that can contain both [[SuccessResult]]s
 * and [[FailureResult]]s. You can use [[Collection.successes]] and
 * [[Collection.failures]] to extract the respective types
 *
 * @param res
 */
export async function allSetteled<T>(
  res: Array<T | Promise<T>>
): Promise<Collection<SuccessResult<ValueType<T>> | FailureResult>> {
  return guard(res, true)
}

/**
 * Creates a `Promise` that resolved to either a [[SuccessCollection]] or a
 * [[FailureCollection]].
 *
 * This behaves pretty much the same as `Promise.all()`, so it will abort and
 * return a [[FailureCollection]] as soon as a value is a rejected value.
 *
 * @param res
 * @returns Note that if a [[FailureCollection]] is returned it will alway be of
 * length `1`
 */
export async function all<T>(
  res: Array<T | Promise<T>>
): Promise<
  | SuccessCollection<SuccessResult<ValueType<T>>>
  | FailureCollection<FailureResult>
> {
  return guard(res, false)
}
