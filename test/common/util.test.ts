import { findFactors } from "../../src/common/util"

describe("util", () => {
  describe("findFactors", () => {
    test("The factors of 8 are [1, 2, 4, 8]", () => {
      const factors = findFactors(8)
      const expected: number[] = [1, 2, 4, 8]

      expect(factors).toEqual(expected)
    })

    test("The factors of 9 are [1, 3, 9]", () => {
      const factors = findFactors(9)
      const expected: number[] = [1, 3, 9]

      expect(factors).toEqual(expected)
    })

    test("The factors of 7 are [1, 7]", () => {
      const factors = findFactors(7)
      const expected: number[] = [1, 7]

      expect(factors).toEqual(expected)
    })

    test("Finding the factors of 0.5 throws an error", () => {
      expect(() => {
        findFactors(0.5)
      }).toThrow()
    })

    test("Finding the factors of -1 throws an error", () => {
      expect(() => {
        findFactors(-1)
      }).toThrow()
    })
  })
})
