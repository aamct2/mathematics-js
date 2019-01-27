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

  test("square matrix multiplication", () => {
    const lhs = new SquareMatrix(2, RealNumber)
    lhs.setItem(0, 0, new RealNumber(1))
    lhs.setItem(0, 1, new RealNumber(0))
    lhs.setItem(1, 0, new RealNumber(2))
    lhs.setItem(1, 1, new RealNumber(-1))

    const rhs = new SquareMatrix(2, RealNumber)
    rhs.setItem(0, 0, new RealNumber(3))
    rhs.setItem(0, 1, new RealNumber(1))
    rhs.setItem(1, 0, new RealNumber(2))
    rhs.setItem(1, 1, new RealNumber(1))

    const expectedMatrix = new SquareMatrix(2, RealNumber)
    expectedMatrix.setItem(0, 0, new RealNumber(3))
    expectedMatrix.setItem(0, 1, new RealNumber(1))
    expectedMatrix.setItem(1, 0, new RealNumber(4))
    expectedMatrix.setItem(1, 1, new RealNumber(1))

    expect(lhs.multiply(rhs).isEqualTo(expectedMatrix)).toBeTruthy()
  })
})
