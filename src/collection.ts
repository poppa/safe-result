import {
  Result,
  success,
  failure,
  AsyncResult,
  SuccessResult,
  FailureResult,
} from './result'
import { isPromise, isError } from './internal'
import { isResult, isFailure } from './helpers'

export abstract class Collection<R extends Result[] = Result[]> {
  protected _result: R

  public abstract readonly success: boolean
  public abstract readonly failure: boolean

  constructor(_args: R) {
    this._result = _args
  }

  public get result(): R {
    return this._result
  }

  public unwrap(): unknown[] {
    return this._result.map((x) => x.result)
  }
}

export class SuccessCollection<R extends SuccessResult[]> extends Collection<
  R
> {
  public readonly success = true
  public readonly failure = false
}

export class FailureCollection<R extends FailureResult[]> extends Collection<
  R
> {
  public readonly success = false
  public readonly failure = true
}

export async function all<T extends unknown[]>(res: T): Promise<Collection> {
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

  try {
    const resolved = (await Promise.all(guard)) as SuccessResult[]
    return new SuccessCollection(resolved)
  } catch (e) {
    return new FailureCollection([isFailure(e) ? e : failure(e)])
  }

  // return Promise.all(guard)
}
