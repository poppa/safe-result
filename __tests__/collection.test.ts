import 'jest'
import { Result, success, failure } from '../src/result'
import { all, SuccessCollection, FailureCollection } from '../src/collection'

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

describe('Collection tests', () => {
  test('Collection.all() with successes should return an instance of SuccessCollection', async () => {
    const args = [
      gimmeAsync(1, true),
      gimmeAsync(2, true),
      gimmeAsync(3, false),
    ]

    const res = await all(args)
    expect(res instanceof SuccessCollection).toEqual(true)
    expect(res.success).toEqual(true)
    expect(res.failure).toEqual(false)
    expect(res.result.length).toEqual(3)
  })

  test('Collection.all() with an error should return an instance of ErrorCollection', async () => {
    const args = [
      gimmeAsync(1, true),
      gimmeAsyncError(new Error('Fail'), false),
    ]

    const res = await all(args)
    expect(res instanceof FailureCollection).toEqual(true)
    expect(res.success).toEqual(false)
    expect(res.failure).toEqual(true)
    expect(res.result.length).toEqual(1)
  })
})
