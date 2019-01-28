import { Matrix } from "./Matrix"

export class SquareMatrix<T extends IComparable<T> & ISubtractable<T> & IDivideable<T>> extends Matrix<T>
  implements IEquatable<SquareMatrix<T>>, IMultipliable<SquareMatrix<T>> {
  public constructor(width: number = 3, tConstructor: new () => T) {
    super(width, width, tConstructor)
  }

  public get trace(): T {
    let sum: T = new this.tConstructor().additiveIdentity

    for (let index = 0; index < this.width; index++) {
      const component = this.item(index, index)

      sum = sum.add(component)
    }

    return sum
  }

  /**
   * Returns the determinant of the matrix by using Laplacian expansion
   */
  public determinant(): T {
    return this.determinantRecursion()
  }

  /**
   * Returns the matrix formed by removing a given row and column.
   * @param rowIndex Index of the row to be removed.
   * @param columnIndex Index of the column to be removed.
   */
  public minor(rowIndex: number, columnIndex: number): SquareMatrix<T> {
    const minorMatrix = new SquareMatrix<T>(this.width - 1, this.tConstructor)
    let minorRow = 0
    let minorColumn = 0

    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        if (row !== rowIndex && column !== columnIndex) {
          minorMatrix.setItem(minorRow, minorColumn, this.item(row, column))

          minorColumn++
          if (minorColumn > this.width - 2) {
            minorColumn = 0
            minorRow++
          }
        }
      }
    }

    return minorMatrix
  }

  /**
   * Multiplies this matrix by another.
   * @param rhs The other matrix by which to multiply.
   */
  public multiply(rhs: SquareMatrix<T>): SquareMatrix<T> {
    if (this.width !== rhs.height) {
      throw new Error("This matrix's height must equal the other matrix's width to be able to multiply.")
    }

    const result = new SquareMatrix<T>(this.width, this.tConstructor)

    for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
      for (let columnIndex = 0; columnIndex < rhs.width; columnIndex++) {
        for (let commonIndex = 0; commonIndex < this.width; commonIndex++) {
          const intermediaryResult = result
            .item(rowIndex, columnIndex)
            .add(this.item(rowIndex, commonIndex).multiply(rhs.item(commonIndex, columnIndex)))

          result.setItem(rowIndex, columnIndex, intermediaryResult)
        }
      }
    }

    return result
  }

  private determinantRecursion(): T {
    if (this.width === 1) {
      // Base case
      return this.item(0, 0)
    } else {
      const exampleT = new this.tConstructor()
      let returnValue = exampleT.additiveIdentity

      for (let topColumnIndex = 0; topColumnIndex < this.width; topColumnIndex++) {
        let minorDeterminant = this.minor(0, topColumnIndex).determinantRecursion()

        if (Math.pow(-1, topColumnIndex) === -1) {
          minorDeterminant = exampleT.additiveIdentity.subtract(minorDeterminant)
        }

        returnValue = returnValue.add(this.item(0, topColumnIndex).multiply(minorDeterminant))
      }

      return returnValue
    }
  }
}
