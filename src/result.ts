export type Result<T = unknown, E = Error> = SuccessResult<T> | FailureResult<E>
export type AsyncResult<T = unknown, E = Error> = Promise<Result<T, E>>
export type ResultTuple<T = unknown, E = unknown> = [T, E]

interface ResultType {
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

export function isResult(o: unknown): o is Result {
  return (
    typeof o === 'object' &&
    (o instanceof SuccessResult || o instanceof FailureResult)
  )
}

export function success<T>(result: T): SuccessResult<T> {
  return new SuccessResult(result)
}

export function failure<E = Error>(error: E): FailureResult<E> {
  return new FailureResult(error)
}

function isPromise(o: unknown): o is Promise<unknown> {
  return typeof o === 'object' && o !== null && 'then' in o
}

function isError(e: unknown): e is Error {
  return typeof e === 'object' && e instanceof Error
}

export async function all<T extends unknown[]>(
  res: T
): Promise<Result<unknown, unknown>[]> {
  const guard: AsyncResult<unknown, unknown>[] = res.map((r) => {
    if (isPromise(r)) {
      return new Promise((resolve, reject) => {
        r.then((res) =>
          resolve(isResult(res) ? res : success(res))
        ).catch((e) => reject(isResult(e) ? e : failure(e)))
      })
    } else {
      if (isResult(r)) {
        return r.success ? Promise.resolve(r) : Promise.reject(r)
      } else {
        return isError(r)
          ? Promise.reject(failure(r))
          : Promise.resolve(success(r))
      }
    }
  })

  return Promise.all(guard)
}
