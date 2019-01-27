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
}
