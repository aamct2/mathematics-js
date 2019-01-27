import { IntegerNumber } from "../../../../common/IntegerNumber"
import { Tuple } from "../../../../common/sets/Tuple"
import { SquareMatrix } from "../../../SquareMatrix"

/**
 * A map for multiplying two square matrices of dimension `N`.
 */
export class SquareMatrixNMultiplicationMap<T extends IComparable<T> & ISubtractable<T> & IDivideable<T>>
  implements IMap<Tuple, SquareMatrix<T>> {
  public readonly dimension: IntegerNumber

  public constructor(dimension: IntegerNumber) {
    this.dimension = dimension
  }

  public applyMap(input: Tuple): SquareMatrix<T> {
    if (input.elements[0].constructor !== input.elements[1].constructor) {
      throw new Error(
        "The input for the `SquareMatrixNMultiplicationMap` contained an element that was not an `SquareMatrix`."
      )
    }

    const lhs: SquareMatrix<T> = input.elements[0]
    const rhs: SquareMatrix<T> = input.elements[1]
    if (lhs.width !== this.dimension.value || rhs.width !== this.dimension.value) {
      throw new Error(
        `The input for the SquareMatrixNAdditionMap contained an element that did not have a height of ${
          this.dimension
        }.`
      )
    }

    return lhs.multiply(rhs)
  }
}
