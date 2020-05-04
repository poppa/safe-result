# safe-result

One of the more challenging things in software development is error handling.
When should an error be throw? When should it be caught? Should I catch it
silently and return "`undefined`"? But if I do that someone higher up the
callstack might want to get hold of the error for logging and what not.

The purpose of this library is trying to make this a bit more coherent.
Languages like Rust and Go have built-in mechanisms to make error handling a
bit more concise and coherent than using `try / catch`, which imho litters the
the code enormously.

What more is, you often need to resort to using `let` instead of `const`
just because you need to use the value after `try / catch`.

The usecase for this library is to be used in you own library functions in your
application. There really is no way around resorting to `try / catch` in
Javascript, so you will have to use `try / catch` in your own "low-level" code.

## API

You can either import the module via the default import

```ts
import Result from 'safe-result'
```

or only import the methods you need

```ts
import { success, failure } from 'safe-result'
```

- ### `function success<T>(value: T): SuccessResult<T>`

  Method for creating a successful result.

- ### `function failure<T>(error: T): FailureResult<T>`

  Method for creating a failed result.

- ### `type Result<T = unknown, E = Error> = SuccessResult<T> | FailureResult<E>`

  Type that can be used as return type in methods returning either a
  `SuccessResult` or `FailureResult`.

  ```ts
  function myFunc(ok: boolean): Result<{ name: string; age: number }> {
    return ok
      ? success({ name: 'John Doe', age: 54 })
      : failure(new Error('Bad'))
  }
  ```

- ### `type AsyncResult<T = unknown, E = Error> = Promise<Result<T, E>>`

  Same as writing `Promise<Result<T, E>>`.

- ### `async function all<T>(values: (T | PromiseLike<T>)[]): Promise<Result<T[]>>`

  Behaves like `Promise.all()` except it doesn't throw. If all values are
  resolved this promise will resolve to a `SuccessResult` where the `result`
  property is an array of the resolved values.

  If one value fails, this promise will immediately resolve to a
  `FailureResult` where the `error` property is the error from the rejected
  promise.

- ### `async function allSetteled<T>(values: Array<T | Promise<T>>): Promise<SuccessAndFailureResult<T[], Error[]>>`

  Just like `Promise.allSettled()` this will wait for all values to either
  resolve or reject. This will always return a `SuccessAndFailureResult`
  instance where both the `result` and `error` properties can be "truthy".

## Examples

### Single values

A single successful value is represented by an instance of `SuccessResult`.
A single failed value is represented by an instance of `FailureResult`.

Instances of these classes can be created by calling `success(okValue)` and
`failure(Error)` respectively.

```ts
import Result from 'safe-result'

function unsafeMethod(): Result<{ name: string; age: number }> {
  try {
    return Result.success(callToMethodThatMightThrow())
  } catch (e) {
    return Result.failure(e)
  }
}

// Method one
const r1 = unsafeMethod()

if (r1.success) {
  console.log('Got OK result', r1.result) // {name: 'Some string', age: x}
} else {
  console.log('Got failed result:', r1.error) // Error('some error')
}

// Method 2
const [result, error] = unsafeMethod().unwrap()

if (error) {
  console.error(error)
  return
}

// Safe to index result here
console.log(`Name:`, result.name)
```

### Async collections

#### `Result.all()`

`safe-result` sort of implements `Promise.all()`, except it doesn't throw when
a value is rejected. Instead you get back a `FailureResult` on error and a
`SuccessResult` if all promises were resovled.

```ts
import Result, { success, failure } from 'safe-result'

const args = [Promise.resolve(1), Promise.resovle(2)]
const [r1, e1] = (await Result.all(args)).unwrap()

if (e1) {
  console.error(`An error occured:`, e1.message)
  return
}

console.log(r1) // [1, 2]
```

**Note:** `Result.all()` doesn't neccessarily have to be given `Promises` or
`Promise<Result>`-objects as arguments. If an argument isn't a promise, one
will be created.

**Note:** If the value array given to `Result.all()` are of different types
you have to explicitly state the types of elements in the array argument for
the type inference of the result to be correct. This however is no different
from how `Promise.all()` behaves.

```ts
const args: Promise<number | string>[] = [
  Promise.resovle(1),
  Promise.resolve('two'),
]

const [res] = (await Result.all(args)).unwrap()

if (res) {
  // Infered type of `res` here will be `Array<string | number>`
}
```

...

#### `Result.allSettled()`

This works pretty much the same as `Promise.allSettled()` except you get back
a `SuccessAndFailureResult` instance. The way this differs from the
`SuccessResult` and `FailureResult` classes is that this can be both a success
and a failure at the same time.

```ts
const args = [Promise.resovle(1), Promise.reject(new Error('Fail'))]

const res = await Result.allSettled(args)

if (res.success) {
  // Will be true in this case
  // res.result -> [1]
}

if (res.failure) {
  // Will also be true in this case
  // res.error -> [Error('Fail')]
}

// If you simply want to ignore eventual errors

const [res] = (await Result.allSettled(args)).unwrap()
```
