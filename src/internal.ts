export function isPromise(o: unknown): o is Promise<unknown> {
  return typeof o === 'object' && o !== null && 'then' in o
}

export function isError(e: unknown): e is Error {
  return typeof e === 'object' && e instanceof Error
}
