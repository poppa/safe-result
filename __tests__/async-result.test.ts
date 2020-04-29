import 'jest'

import {
  success,
  all,
  Result,
  SuccessResult,
  failure,
  FailureResult,
} from '../src/result'

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
declare function gimmeAsync<T, A extends boolean>(
  v: T,
  a: A
): A extends true ? Promise<Result<T>> : Promise<T>

function gimmeAsync<T, A extends boolean>(
  v: T,
  asResult: A
): Promise<Result<T> | T> {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(asResult ? success(v) : v),
      Math.ceil(Math.random() * 100)
    )
  })
}

function gimmeAsyncError<V>(v: V, asResult: boolean): Promise<unknown> {
  return new Promise((_, reject) => {
    setTimeout(
      () => reject(asResult ? failure(v) : v),
      Math.ceil(Math.random() * 100)
    )
  })
}

describe('Async Result tests', () => {
  test('all() with successes should return all `SuccessResult`s', async () => {
    const vals: Promise<unknown>[] = [
      gimmeAsync(1, true),
      gimmeAsync('2', false),
      gimmeAsync(3, true),
    ]

    const res = await all(vals)

    expect(res.every((i) => i instanceof SuccessResult)).toEqual(true)
  })

  test('all() with failure should throw', async () => {
    const vals = [
      gimmeAsync(1, true),
      gimmeAsyncError(new Error('Fail 1'), true),
      gimmeAsync(2, true),
    ]

    try {
      await all(vals)
      fail('Expected all() with rejected promise to throw')
    } catch (e) {
      expect(e instanceof FailureResult).toEqual(true)
    }
  })

  test('all() with plain Error object should throw FailureResult', async () => {
    const vals = [1, new Error('Fail')]

    try {
      await all(vals)
      fail('Expected all() with plain Error to throw')
    } catch (e) {
      expect(e instanceof FailureResult).toEqual(true)
    }
  })
})
