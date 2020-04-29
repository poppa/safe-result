import 'jest'

import { success, failure, SuccessResult, FailureResult } from '../src/result'

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

  test('Typeguard for Result.unwrap() should be ok', () => {
    const [ok, err] = success({ value: 1 }).unwrap()

    if (err) {
      fail(err)
    }

    // Typescript should detect that `ok` can not be undefined here since
    // fail() has return type `never`. So if `err` is defined we this should
    // be unreachable
    expect(ok.value).toEqual(1)
  })
})
