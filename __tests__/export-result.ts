import 'jest'

import Result, {
  success,
  failure,
  FailureResult,
  SuccessResult,
  AsyncResult,
  Result as TResult,
  ResultTuple,
  all,
  allSetteled,
  isFailure,
  isResult,
  isSuccess,
} from '../src'

function s(): SuccessResult<number> {
  return success(1)
}

function e(): FailureResult {
  return failure(new Error('Fail'))
}

describe('export should do what it should do', () => {
  test('isResult() should be imported', () => {
    expect(isResult(success('test'))).toEqual(true)
    expect(isResult(failure('test'))).toEqual(true)
  })

  test('allSettled() should be imported', async () => {
    expect((await allSetteled([1])).unwrap()).toEqual([[1], []])
  })

  test('all() should be imported', async () => {
    expect((await all([1])).unwrap()).toEqual([[1], undefined])
  })

  test('ResultTuple should be imported', () => {
    expect([0, 1] as ResultTuple<number, number>).toEqual([0, 1])
  })

  test('Result type should be imported', () => {
    expect({} as TResult).toEqual({})
  })

  test('AsyncResult should be imported', () => {
    expect({} as AsyncResult).toEqual({})
  })

  test('SuccessResult is ok', () => {
    expect(isSuccess(s())).toEqual(true)
  })

  test('FailureResult is ok', () => {
    expect(isFailure(e())).toEqual(true)
  })

  test('all() on default import', async () => {
    const all = await Result.all([s(), s()])
    expect(all.success).toEqual(true)
  })
})
