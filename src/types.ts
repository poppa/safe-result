/**
 * A result tuple with two indices where the first index is a success result
 * and the second is an error result. These should be mutually exclusive.
 */
export type ResultTuple<T = unknown, E = unknown> = [T, E]
