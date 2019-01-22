import { Matrix } from "./Matrix"

export class SquareMatrix<T extends IComparable<T> & ISubtractable<T>> extends Matrix<T>
  implements IEquatable<SquareMatrix<T>> {
  private tConstructor: new () => T
  public constructor(width: number = 3, tConstructor: new () => T) {
    super(width, width, tConstructor)

    this.tConstructor = tConstructor
  }

  public get trace(): T {
    let sum: T = new this.tConstructor().additiveIdentity

    for (let index = 0; index < this.width; index++) {
      const component = this.item(index, index)

      sum = sum.add(component)
    }

    return sum
  }
}
