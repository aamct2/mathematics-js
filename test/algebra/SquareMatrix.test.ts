import { SquareMatrix } from "../../src/algebra/SquareMatrix"
import { RealNumber } from "../../src/common/RealNumber"

describe("SquareMatrix", () => {
  describe("Given the matrix [[1, 3], [5, 11]]", () => {
    const matrix = new SquareMatrix(2, RealNumber)
    matrix.setItem(0, 0, new RealNumber(1))
    matrix.setItem(0, 1, new RealNumber(3))
    matrix.setItem(1, 0, new RealNumber(5))
    matrix.setItem(1, 1, new RealNumber(11))

    test("the trace is 12", () => {
      expect(matrix.trace.value).toBe(12)
    })
  })
})
