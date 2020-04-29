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

  test('success().truthy should be true', () => {
    const r1 = success(0)
    expect(r1.truthy).toBeTruthy()

    const r2 = success(false)
    expect(r2.truthy).toBeTruthy()

    const r3 = success('')
    expect(r3.truthy).toBeTruthy()

    const r4 = success([])
    expect(r4.truthy).toBeTruthy()
  })

  test('success().falsy should be false', () => {
    const r1 = success(0)
    expect(r1.falsy).toBeFalsy()

    const r2 = success(false)
    expect(r2.falsy).toBeFalsy()

    const r3 = success('')
    expect(r3.falsy).toBeFalsy()

    const r4 = success([])
    expect(r4.falsy).toBeFalsy()
  })

  test('failure().falsy should be true', () => {
    const r1 = failure(false)
    expect(r1.falsy).toBeTruthy()

    const r2 = failure(new Error('failure'))
    expect(r2.falsy).toBeTruthy()
  })

  test('failure().truthy should be false', () => {
    const r1 = failure(false)
    expect(r1.truthy).toBeFalsy()

    const r2 = failure(new Error('failure'))
    expect(r2.truthy).toBeFalsy()
  })
})
