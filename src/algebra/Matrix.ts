import { RealNumber } from "../common/RealNumber"

/**
 * Represents a matrix with elements of type T.
 *
 * @template T The `type` of elements used for entries in the matrix.
 */
export class Matrix<T extends IComparable<T> & ISubtractable<T> & IDivideable<T>>
  implements IEquatable<Matrix<T>>, IMultipliable<Matrix<T>> {
  protected tConstructor: new () => T
  private data: T[][]

  public constructor(height: number = 3, width: number = 3, tConstructor: new () => T) {
    if (width < 1) {
      throw new Error("The width of a matrix cannot be < 1")
    } else if (height < 1) {
      throw new Error("The height of a matrix cannot be < 1")
    }

    this.data = []
    this.tConstructor = tConstructor

    const exampleT = new tConstructor()

    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      this.data.push([])

      for (let columnIndex = 0; columnIndex < width; columnIndex++) {
        this.data[rowIndex].push(exampleT.additiveIdentity)
      }
    }
  }

  /**
   * Gets the number of components in the matrix (Width * Height).
   */
  public get count(): number {
    return this.width * this.height
  }

  /**
   * Gets the width of the matrix (number of columns).
   */
  public get width(): number {
    return this.data[0].length
  }

  /**
   * Gets the height of the matrix (number of rows).
   */
  public get height(): number {
    return this.data.length
  }

  public isEqualTo(rhs: Matrix<T>): boolean {
    if (this.height !== rhs.height || this.width !== rhs.width) {
      return false
    }

    for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {
      for (let columnIndex = 0; columnIndex < this.height; columnIndex++) {
        const lhsItem = this.item(rowIndex, columnIndex)
        const rhsItem = rhs.item(rowIndex, columnIndex)
        if (lhsItem.compareTo(rhsItem) !== 0) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Gets the component at `(rowIndex, columnIndex)`.
   * @param rowIndex The index of the row in the matrix from which to fetch the component.
   * @param columnIndex The index of the column in the matrix from which to fetch the component.
   */
  public item(rowIndex: number, columnIndex: number): T {
    return this.data[rowIndex][columnIndex]
  }

  /**
   * Multiplies this matrix by another.
   * @param rhs The other matrix by which to multiply.
   */
  public multiply(rhs: Matrix<T>): Matrix<T> {
    if (this.width !== rhs.height) {
      throw new Error("This matrix's height must equal the other matrix's width to be able to multiply.")
    }

    const result = new Matrix<T>(this.height, rhs.width, this.tConstructor)

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

  /**
   * Sets the component at `(rowIndex, columnIndex)`.
   * @param rowIndex The index of the row in the matrix in which to set the component.
   * @param columnIndex The index of the column in the matrix in which to set the component.
   * @param value The new value to insert into the matrix
   */
  public setItem(rowIndex: number, columnIndex: number, value: T) {
    this.data[rowIndex][columnIndex] = value
  }
}
