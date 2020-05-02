import 'jest'

import Result, {
  success,
  failure,
  FailureResult,
  SuccessResult,
  AsyncResult,
  Collection,
  Result as TResult,
  FailureCollection,
  ResultTuple,
  SuccessCollection,
  all,
  allSetteled,
  isCollection,
  isFailure,
  isFailureCollection,
  isResult,
  isSuccess,
  isSuccessCollection,
  collection,
  successCollection,
  failureCollection,
} from '../src'

function s(): SuccessResult {
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

  test('isSuccessCollection() should be imported', () => {
    expect(isSuccessCollection(new SuccessCollection(...[]))).toEqual(true)
  })

  test('isFailureCollection() should be imported', () => {
    expect(isFailureCollection(new FailureCollection(...[]))).toEqual(true)
  })

  test('isCollection() should be imported', () => {
    expect(isCollection(new Collection(...[]))).toEqual(true)
  })

  test('allSettled() should be imported', async () => {
    expect((await allSetteled([1])).unwrap()).toEqual([1])
  })
  test('all() should be imported', async () => {
    expect((await all([1])).unwrap()).toEqual([1])
  })

  test('ResultTuple should be imported', () => {
    expect([0, 1] as ResultTuple<number, number>).toEqual([0, 1])
  })

  test('SuccessCollection should be imported', () => {
    expect({} as SuccessCollection<Result.SuccessResult>).toEqual({})
  })

  test('FailureCollection should be imported', () => {
    expect({} as FailureCollection<Result.FailureResult>).toEqual({})
  })

  test('Result type should be imported', () => {
    expect({} as TResult).toEqual({})
  })

  test('Collection should be imported', () => {
    expect({} as Collection).toEqual({})
  })

  test('AsyncResult should be imported', () => {
    expect({} as AsyncResult).toEqual({})
  })

  test('Collection should be imported', () => {
    expect({} as Collection).toEqual({})
  })

  test('SuccessResult is ok', () => {
    expect(isSuccess(s())).toEqual(true)
  })

  test('FailureResult is ok', () => {
    expect(isFailure(e())).toEqual(true)
  })

  test('all() on default import', async () => {
    const all = await Result.all([s(), s()])
    expect(all.every((s: Result.Result) => s.success)).toEqual(true)
  })

  test('collection() is ok', () => {
    expect(collection([success(1)])).toBeTruthy()
  })

  test('successCollection() is ok', () => {
    expect(successCollection([success(1)])).toBeTruthy()
  })

  test('failureCollection() is ok', () => {
    expect(failureCollection([failure(new Error('1'))])).toBeTruthy()
  })
})
