/* eslint-disable @typescript-eslint/no-empty-function */
import 'jest'
import {
  success,
  SuccessResult,
  failure,
  FailureResult,
  SuccessAndFailureResult,
} from '../src/result'
import { all, allSetteled } from '../src/collection'

function gimmeAsync<T, A extends boolean>(
  v: T,
  asResult: A,
  time = 0
): Promise<A extends true ? SuccessResult<T> : T> {
  return new Promise((resolve) => {
    time = time || Math.ceil(Math.random() * 10)
    setTimeout(
      // I have no friggin idea why this is complained about.
      // VSCode resolves it properly when this method is called
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      () => resolve(asResult ? success(v) : v),
      time
    )
  })
}

function gimmeAsyncError<T, A extends boolean>(
  v: T,
  asResult: boolean,
  time = 0
): Promise<A extends true ? SuccessResult<T> : T> {
  return new Promise((_, reject) => {
    time = time || Math.ceil(Math.random() * 10)
    setTimeout(
      () =>
        reject(
          asResult
            ? failure(new Error(`${v} failed`))
            : new Error(`${v} failed`)
        ),
      time
    )
  })
}

describe('Collection tests', () => {
  test('Collection.all() with successes should return an instance of SuccessResult', async () => {
    const thenFn = <T>(a: T): T => a
    const successCallback: typeof thenFn = jest.fn(thenFn)

    const args = [
      gimmeAsync(1, true).then(successCallback),
      gimmeAsync(2, true).then(successCallback),
      gimmeAsync(4, true).then(successCallback),
    ]

    const res = await all(args)
    expect(res instanceof SuccessResult).toEqual(true)
    expect(res.success).toEqual(true)
    expect(res.failure).toEqual(false)
    expect(res.result).toEqual([1, 2, 4])
    expect(res.unwrap()).toEqual([[1, 2, 4], undefined])
    expect(successCallback).toHaveBeenCalledTimes(3)
  })

  test('Collection.all() with an error promise should return a FailureResult', async () => {
    const args = [gimmeAsync(1, true), gimmeAsyncError(2, true)]

    const res = await all(args)
    expect(res instanceof FailureResult).toEqual(true)
    expect(res.error instanceof Error).toEqual(true)
    expect(res.success).toEqual(false)
    expect(res.failure).toEqual(true)

    const [, err] = res.unwrap()

    if (err) {
      expect(err.message).toEqual(`2 failed`)
    } else {
      fail('Expected err to be defined')
    }
  })

  test('Collection.all() with a failure should abort resolving other promises', async () => {
    const thenFn = <T>(a: T): T => a
    const successCallback: typeof thenFn = jest.fn(thenFn)

    const args = [
      gimmeAsync(1, true, 10).then(successCallback),
      gimmeAsync(2, true, 5).then(successCallback),
      gimmeAsyncError(3, true, 2).then(successCallback),
    ]

    const [res, err] = (await all(args)).unwrap()
    expect(res).toBeUndefined()
    expect(err).toBeDefined()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(err!.message).toEqual(`3 failed`)
    expect(successCallback).toHaveBeenCalledTimes(0)
  })

  test('Collection.allSettled() should resolve or reject all values', async () => {
    const args = [
      gimmeAsync(1, true),
      gimmeAsync(2, true),
      gimmeAsyncError(3, true),
      gimmeAsyncError(4, true),
      gimmeAsync(5, true),
    ]

    const res = await allSetteled(args)

    expect(res instanceof SuccessAndFailureResult).toEqual(true)
    expect(res.success).toEqual(true)
    expect(res.failure).toEqual(true)
    expect(res.result).toEqual([1, 2, 5])
    expect(res.error.length).toEqual(2)
  })

  test('Collection.allSettled() with only successes should have a false `failure` property', async () => {
    const args = [gimmeAsync(1, true), gimmeAsync(2, true)]

    const res = await allSetteled(args)
    expect(res.failure).toEqual(false)

    const [r, e] = res.unwrap()
    expect(e).toEqual([])
    expect(r).toEqual([1, 2])
  })
})
