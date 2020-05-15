import 'jest'

import {
  success,
  failure,
  SuccessResult,
  FailureResult,
  Result,
} from '../src/result'

describe('Sync Result tests', () => {
  test('success() should return an instance of SuccessResult', () => {
    const s = success(1)
    expect(s instanceof SuccessResult).toEqual(true)
  })

  test('failure() should return an instance of FailureResult', () => {
    const s = failure(1)
    expect(s instanceof FailureResult).toEqual(true)
  })

  test('success().unwrap() should have result at 0th index and undefined error at 1st index', () => {
    const [r, e] = success(1).unwrap()
    expect(r).toEqual(1)
    expect(e).toBeUndefined()
  })

  test('failure().unwrap() should have undefined at 0th index and error at 1st index', () => {
    const [r, e] = failure(1).unwrap()
    expect(e).toEqual(1)
    expect(r).toBeUndefined()
  })

  test('success().success should be true', () => {
    const r1 = success(0)
    expect(r1.success).toBeTruthy()

    const r2 = success(false)
    expect(r2.success).toBeTruthy()

    const r3 = success('')
    expect(r3.success).toBeTruthy()

    const r4 = success([])
    expect(r4.success).toBeTruthy()
  })

  test('success().failure should be false', () => {
    const r1 = success(0)
    expect(r1.failure).toBeFalsy()

    const r2 = success(false)
    expect(r2.failure).toBeFalsy()

    const r3 = success('')
    expect(r3.failure).toBeFalsy()

    const r4 = success([])
    expect(r4.failure).toBeFalsy()
  })

  test('failure().failure should be true', () => {
    const r1 = failure(false)
    expect(r1.failure).toBeTruthy()

    const r2 = failure(new Error('failure'))
    expect(r2.failure).toBeTruthy()
  })

  test('failure().success should be false', () => {
    const r1 = failure(false)
    expect(r1.success).toBeFalsy()

    const r2 = failure(new Error('failure'))
    expect(r2.success).toBeFalsy()
  })

  // FIXME: This isn't testing what we think it is testing.
  // See https://github.com/poppa/safe-result/issues/3
  test('Typeguard for Result.unwrap() should be ok', () => {
    const [ok, err] = success({ value: 1 }).unwrap()

    if (err) {
      fail(err)
    }

    // Typescript should detect that `ok` can not be undefined here since
    // fail() has return type `never`. So if `err` is defined we this should
    // be unreachable
    expect(ok.value).toEqual(1)

    function gimmeValue<T>(value: T): Result<T> {
      return success(value)
    }

    const [res, e2] = gimmeValue({ key: 'one' }).unwrap()

    if (e2) {
      throw e2
    }

    // We want to get rid of the null coalescing here
    expect(res?.key).toEqual('one')
  })
})
