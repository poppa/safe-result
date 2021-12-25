/**
 * These types can be considered internal
 * @packageDocumentation
 */

import type { Result } from './result'

/**
 * A result tuple with two indices where the first index is a success result
 * and the second is an error result. These should be mutually exclusive.
 */
export type ResultTuple<T = unknown, E = unknown> = [T, E]

/**
 * Extracts the type of the value from a [[Result]] type
 */
export type ValueType<T> = T extends Result<infer RT> ? RT : T
