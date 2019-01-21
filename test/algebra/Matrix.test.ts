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
})
