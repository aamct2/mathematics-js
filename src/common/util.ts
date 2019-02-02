/**
 * Finds all factors of a given positive integer.
 * @param value The integer for which to find the factors.
 */
export function findFactors(value: number): number[] {
  if (!Number.isInteger(value) || !(value > 0)) {
    throw new Error("Expected `value` to be a positive integer.")
  }

  const result: number[] = []

  result.push(1)

  for (let index = 2; index < value + 1; index++) {
    if (value % index === 0) {
      result.push(index)
    }
  }

  return result
}
