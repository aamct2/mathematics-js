import { Matrix } from "../../src/algebra/Matrix"
import { RealNumber } from "../../src/common/RealNumber"

describe("Matrix", () => {
  describe("given a matrix [[0, 0, 0], [1, 1, 1], [2, 2, 2]]", () => {
    const matrix = new Matrix<RealNumber>(3, 3, RealNumber)

    beforeEach(() => {
      for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
          matrix.setItem(rowIndex, columnIndex, new RealNumber(rowIndex))
        }
      }
    })

    test("it's count is 9", () => {
      expect(matrix.count).toBe(9)
    })

    test("it's height is 3", () => {
      expect(matrix.height).toBe(3)
    })

    test("it's width is 3", () => {
      expect(matrix.width).toBe(3)
    })

    test("the element at (1, 1) is 1", () => {
      expect(matrix.item(1, 1).isEqualTo(new RealNumber(1))).toBeTruthy()
    })

    test("setting the item is maintained", () => {
      matrix.setItem(1, 1, new RealNumber(5.5))
      expect(matrix.item(1, 1).value).toBe(5.5)
    })
  })

  test("matrix multiplication", () => {
    const lhs = new Matrix(2, 3, RealNumber)
    lhs.setItem(0, 0, new RealNumber(1))
    lhs.setItem(0, 1, new RealNumber(0))
    lhs.setItem(0, 2, new RealNumber(2))
    lhs.setItem(1, 0, new RealNumber(-1))
    lhs.setItem(1, 1, new RealNumber(3))
    lhs.setItem(1, 2, new RealNumber(1))

    const rhs = new Matrix(3, 2, RealNumber)
    rhs.setItem(0, 0, new RealNumber(3))
    rhs.setItem(0, 1, new RealNumber(1))
    rhs.setItem(1, 0, new RealNumber(2))
    rhs.setItem(1, 1, new RealNumber(1))
    rhs.setItem(2, 0, new RealNumber(1))
    rhs.setItem(2, 1, new RealNumber(0))

    const expectedMatrix = new Matrix(2, 2, RealNumber)
    expectedMatrix.setItem(0, 0, new RealNumber(5))
    expectedMatrix.setItem(0, 1, new RealNumber(1))
    expectedMatrix.setItem(1, 0, new RealNumber(4))
    expectedMatrix.setItem(1, 1, new RealNumber(2))

    expect(lhs.multiply(rhs).isEqualTo(expectedMatrix)).toBeTruthy()
  })
})
