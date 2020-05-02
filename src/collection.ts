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

  public unwrap(): unknown[] {
    return this.map((x) => x.result)
  }

  public unwrapAll(): unknown[][] {
    return this.map((r) => r.unwrap())
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
): Promise<SuccessCollection<SuccessResult> | FailureCollection<FailureResult>>

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
      return new Collection(...resolved)
    } else {
      return new SuccessCollection(...(resolved as SuccessResult[]))
    }
  } catch (e) {
    return new FailureCollection(...[isFailure(e) ? e : failure(e)])
  }
}

export function collection<T extends Result>(res: T[]): Collection<T> {
  return new Collection(...res)
}

export function successCollection<T extends SuccessResult>(
  res: T[]
): SuccessCollection<T> {
  return new SuccessCollection(...res)
}

export function failureCollection<T extends FailureResult>(
  res: T[]
): FailureCollection<T> {
  return new FailureCollection(...res)
}

export async function allSetteled<T extends unknown[]>(
  res: T
): Promise<Collection> {
  return guard(res, true)
}

export async function all<T extends unknown[]>(
  res: T
): Promise<
  SuccessCollection<SuccessResult> | FailureCollection<FailureResult>
> {
  return guard(res, false)
}
