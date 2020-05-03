/* eslint-disable @typescript-eslint/no-empty-function */
import 'jest'
import { success, failure, SuccessResult } from '../src/result'
import {
  all,
  SuccessCollection,
  FailureCollection,
  allSetteled,
  Collection,
} from '../src/collection'

function gimmeAsync<T, A extends boolean>(
  v: T,
  asResult: A,
  time = 0
): Promise<A extends true ? SuccessResult<T> : T> {
  return new Promise((resolve) => {
    setTimeout(
      // I have no friggin idea why this is complained about.
      // VSCode resolves it properly when this method is called
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      () => resolve(asResult ? success(v) : v),
      time || Math.ceil(Math.random() * 100)
    )
  })
}

function gimmeAsyncError<V>(
  v: V,
  asResult: boolean,
  time = 0
): Promise<unknown> {
  return new Promise((_, reject) => {
    setTimeout(
      () => reject(asResult ? failure(v) : v),
      time || Math.ceil(Math.random() * 100)
    )
  })
}

describe('Collection tests', () => {
  test('Collection.all() with successes should return an instance of SuccessCollection', async () => {
    const thenFn = <T>(a: T): T => a
    const successCallback: typeof thenFn = jest.fn(thenFn)

    const args = [
      gimmeAsync(1, true).then(successCallback),
      gimmeAsync(2, true).then(successCallback),
      gimmeAsync(3, false).then(successCallback),
    ]

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const res = await all(args)

    if (res.failure) {
      fail('Expected res.failure to be false')
    }

    expect(successCallback).toBeCalledTimes(3)
    expect(res instanceof SuccessCollection).toEqual(true)
    expect(Array.isArray(res)).toEqual(true)
    expect(res.success).toEqual(true)
    expect(res.successes.length).toEqual(3)
    expect(res.failure).toEqual(false)
    expect(res.failures.length).toEqual(0)
    expect(res.length).toEqual(3)
  })

  test('Collection.all() with an error should return an instance of ErrorCollection', async () => {
    const successCallback = jest.fn((): void => {})

    const args = [
      gimmeAsync(1, true, 10).then(successCallback),
      gimmeAsyncError(new Error('Fail'), false, 1),
    ]

    const res = await all(args)
    expect(successCallback).toHaveBeenCalledTimes(0)
    expect(res instanceof FailureCollection).toEqual(true)
    expect(Array.isArray(res)).toEqual(true)
    expect(res.success).toEqual(false)
    expect(res.successes.length).toEqual(0)
    expect(res.failure).toEqual(true)
    expect(res.failures.length).toEqual(1)
    expect(res.length).toEqual(1)
  })

  test('Collection.allSettled() should not throw and return an array of successes and failures', async () => {
    const args = [
      gimmeAsync(1, true),
      gimmeAsyncError(new Error('Fail 1'), true),
      gimmeAsyncError(new Error('Fail 2'), true),
      gimmeAsync(2, false),
    ]

    const res = await allSetteled(args)

    expect(res instanceof Collection).toEqual(true)
    expect(res.successes.length).toEqual(2)
    expect(res.failures.length).toEqual(2)
  })

  test('Collection.unwrap() should return correct types and values', () => {
    const c = new Collection(success(1), success(2))
    const z: number[] = c.unwrap()
    expect(z).toEqual([1, 2])
  })
})
