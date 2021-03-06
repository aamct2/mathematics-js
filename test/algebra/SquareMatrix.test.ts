import { SquareMatrix } from "../../src/algebra"
import { RealNumber } from "../../src/common/numbers"

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

    test("multiplying by a 3x3 matrix throws an error", () => {
      const secondMatrix = new SquareMatrix(3, RealNumber)

      expect(() => {
        matrix.multiply(secondMatrix)
      }).toThrow()
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

  test("determinant", () => {
    const matrix = new SquareMatrix(3, RealNumber)
    matrix.setItem(0, 0, new RealNumber(-2))
    matrix.setItem(0, 1, new RealNumber(2))
    matrix.setItem(0, 2, new RealNumber(-3))
    matrix.setItem(1, 0, new RealNumber(-1))
    matrix.setItem(1, 1, new RealNumber(1))
    matrix.setItem(1, 2, new RealNumber(3))
    matrix.setItem(2, 0, new RealNumber(2))
    matrix.setItem(2, 1, new RealNumber(0))
    matrix.setItem(2, 2, new RealNumber(-1))

    expect(matrix.determinant().value).toBe(18)
  })

  test("determinant of the identity is 1", () => {
    const matrix = new SquareMatrix(2, RealNumber)
    matrix.setItem(0, 0, new RealNumber(1))
    matrix.setItem(0, 1, new RealNumber(0))
    matrix.setItem(1, 0, new RealNumber(0))
    matrix.setItem(1, 1, new RealNumber(1))

    expect(matrix.determinant().value).toBe(1)
  })
})
