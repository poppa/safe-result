import type { AsyncResult, Result } from './result'
import {
  FailureResult,
  SuccessAndFailureResult,
  SuccessResult,
  failure,
  success,
} from './result'
import { isError, isPromise, toFailure, toSuccess } from './internal'
import { isFailure, isResult, isSuccess } from './typeguards'
import type { ValueType } from './types'

/**
 * @internal
 */
async function guard(res: unknown[], noThrow: boolean): Promise<unknown> {
  try {
    const x: AsyncResult[] = res.map((r) => {
      if (isPromise(r)) {
        return new Promise((resolve, reject) => {
          r.then((rres) => resolve(toSuccess(rres))).catch((e) =>
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
      return new SuccessAndFailureResult(
        resolved.filter(isSuccess).map((s) => s.result),
        resolved.filter(isFailure).map((e) => e.error)
      )
    } else {
      return new SuccessResult(resolved.map((s) => s.result))
    }
  } catch (e: unknown) {
    const fr = isFailure(e) ? e : failure(e)
    return new FailureResult(fr.error)
  }
}

/**
 * Creates a `Promise` that resovles after all values have either resolved or
 * rejected.
 *
 * @note The returned [[SuccessAndFailureResult]] object can indicate being
 * both a `success` and `failure`.
 *
 * If `SuccessAndFailureResult.success` is `true` there are one or more resovled
 * promises.
 *
 * Likewise, if `SuccessAndFailureResult.failure` is `true` there are one or
 * more rejected promises.
 *
 * @example
 *
 * ```ts
 * const args = [
 *   Promise.resolve(success(1)),
 *   Promise.resolve(success(2)),
 *   Promise.reject(failure(new Error('First failure'))),
 * ]
 *
 * const res = await Result.allSettled(args)
 *
 * if (res.success) { // Will be `true` in this case
 *   console.log('Values:', res.result.join(', '))
 *   // Values: 1, 2
 * }
 *
 * if (res.failure) { // Will also be true in this case
 *   console.error('Errors:', res.error.map((e) => e.message).join(', '))
 *   // Errors: First failure
 * }
 * ```
 *
 * @param values
 */
export async function allSettled<T>(
  values: Array<T | Promise<T>>
): Promise<SuccessAndFailureResult<ValueType<T>[], Error[]>> {
  return guard(values, true) as Promise<
    SuccessAndFailureResult<ValueType<T>[], Error[]>
  >
}

/**
 * Creates a `Promise` that resolves to either a [[SuccessResult]] or a
 * [[FailureResult]].
 *
 * This behaves pretty much the same as `Promise.all()`, so it will abort and
 * return a [[FailureResult]] as soon as a value is a rejected value.
 *
 * @example _Example with all resolved promises_
 *
 * ```ts
 * const values = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]
 * const [res, err] = (await Result.all(values)).unwrap()
 *
 * if (err) { // This will never be `true` in this case
 *   return
 * }
 *
 * console.log(
 *   res.map((num) => `Result ${num}`).join(', ')
 * )
 *
 * // Result 1, Result 2, Result 3
 * ```
 *
 * @example _Example where one or more promises are rejected_
 *
 * ```ts
 * const values = [Promise.resolve(1), Promise.reject(2), Promise.resolve(3)]
 * const [res, err] = (await Result.all(values)).unwrap()
 *
 * if (err) { // This will always be `true` in this case
 *   console.error('An error occured:', err.message)
 *   return
 * }
 * ```
 *
 * @param values
 */
export async function all<T>(
  values: (T | PromiseLike<T>)[]
): Promise<SuccessResult<ValueType<T>[]> | FailureResult> {
  return guard(values, false) as Promise<
    SuccessResult<ValueType<T>[]> | FailureResult
  >
}
