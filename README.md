# safe-result

**In heavy _BETA_ state**

Creates a result that is either a success or failure.

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

if (r1.truthy) {
  console.log('Got OK result', r1.result) // {name: 'Some string', age: x}
} else {
  console.log('Got failed result:', r1.result) // Error('some error')
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
