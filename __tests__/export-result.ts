import 'jest'

import Result, { success, failure, FailureResult, SuccessResult } from '../src'

function s(): SuccessResult {
  return success(1)
}

function e(): FailureResult {
  return failure(new Error('Fail'))
}

describe('import should do what it should do', () => {
  test('SuccessResult is ok', () => {
    expect(s().truthy).toEqual(true)
  })

  test('FailureResult is ok', () => {
    expect(e().falsy).toEqual(true)
  })

  test('all() on default import', async () => {
    const all = await Result.all([s(), s()])
    expect(all.every((s) => s.truthy)).toEqual(true)
  })
})
