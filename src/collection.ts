import {
  Result,
  success,
  failure,
  AsyncResult,
  SuccessResult,
  FailureResult,
} from './result'
import { isPromise, isError } from './internal'
import { isResult, isFailure, isSuccess } from './typeguards'

export class Collection<R extends Result[] = Result[]> {
  protected _result: R

  constructor(_args: R) {
    this._result = _args
  }

  public get result(): R {
    return this._result
  }

  public unwrap(): unknown[] {
    return this._result.map((x) => x.result)
  }

  public unwrapAll(): unknown[][] {
    return this._result.map((r) => r.unwrap())
  }

  public get success(): boolean {
    return this.successes.length > 0
  }

  public get failure(): boolean {
    return this.failures.length > 0
  }

  public get successes(): SuccessResult[] {
    return this._result.filter(isSuccess)
  }

  public get failures(): FailureResult[] {
    return this._result.filter(isFailure)
  }

  // [Symbol.iterator](): Iterator<unknown> {
  //   const len = this._result.length
  //   let step = 0
  //   return {
  //     next: (): IteratorResult<unknown> => {
  //       if (step < len) {
  //         return { value: this._result[step++], done: false }
  //       } else {
  //         return { value: null, done: true }
  //       }
  //     },
  //   }
  // }
}

export class SuccessCollection<R extends SuccessResult[]> extends Collection<
  R
> {
  public get success(): true {
    return true
  }

  public get failure(): false {
    return false
  }

  public get successes(): SuccessResult[] {
    return this._result
  }

  public get failures(): [] {
    return []
  }
}

export class FailureCollection<R extends FailureResult[]> extends Collection<
  R
> {
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
    return this._result
  }
}

function toSuccess<T extends SuccessResult | unknown>(e: T): SuccessResult {
  return isSuccess(e) ? e : success(e)
}

function toFailure<T extends FailureResult<unknown> | unknown>(
  e: T
): FailureResult<unknown> {
  return isFailure(e) ? e : failure(e)
}

// Overload signatures must all be ambient or non-ambient.ts(2384)
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
declare function guard<T extends unknown[], N extends true>(
  res: T,
  noThrow: N
): Promise<Collection>

// Overload signatures must all be ambient or non-ambient.ts(2384)
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
declare function guard<T extends unknown[], N extends false>(
  res: T,
  noThrow: N
): Promise<
  SuccessCollection<SuccessResult[]> | FailureCollection<FailureResult[]>
>

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function guard<T extends unknown[], N extends boolean>(
  res: T,
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
      return new Collection(resolved)
    } else {
      return new SuccessCollection(resolved as SuccessResult[])
    }
  } catch (e) {
    return new FailureCollection([isFailure(e) ? e : failure(e)])
  }
}

export async function allSetteled<T extends unknown[]>(
  res: T
): Promise<Collection> {
  return guard(res, true)
}

export async function all<T extends unknown[]>(
  res: T
): Promise<
  SuccessCollection<SuccessResult[]> | FailureCollection<FailureResult[]>
> {
  return guard(res, false)
}
