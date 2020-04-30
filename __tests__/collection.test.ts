/* eslint-disable @typescript-eslint/no-empty-function */
import 'jest'
import { Result, success, failure } from '../src/result'
import { all, SuccessCollection, FailureCollection } from '../src/collection'

function gimmeAsync<T, A extends boolean>(
  v: T,
  asResult: A,
  time = 0
): Promise<Result<T> | T> {
  return new Promise((resolve) => {
    setTimeout(
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
    const successCallback = jest.fn(() => {})

    const args = [
      gimmeAsync(1, true).then(successCallback),
      gimmeAsync(2, true).then(successCallback),
      gimmeAsync(3, false).then(successCallback),
    ]

    const res = await all(args)
    expect(successCallback).toBeCalledTimes(3)
    expect(res instanceof SuccessCollection).toEqual(true)
    expect(res.success).toEqual(true)
    expect(res.successes.length).toEqual(3)
    expect(res.failure).toEqual(false)
    expect(res.failures.length).toEqual(0)
    expect(res.result.length).toEqual(3)
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
    expect(res.success).toEqual(false)
    expect(res.successes.length).toEqual(0)
    expect(res.failure).toEqual(true)
    expect(res.failures.length).toEqual(1)
    expect(res.result.length).toEqual(1)
  })
})
