import { DoesNotSatisfyPropertyError } from "../../common/CommonErrors"
import { FiniteBinaryOperation } from "../../common/functions/FiniteBinaryOperation"
import { FiniteSet } from "../../common/sets/FiniteSet"
import { Tuple } from "../../common/sets/Tuple"

/**
 * Represents a finite magma with elements of type T.
 *
 * @template T The `type` of element in the magma.
 */
export class FiniteMagma<T extends IEquatable<T>> {
  protected magmaProperties: { [key: string]: boolean } = {}

  private set: FiniteSet<T>
  private operation: FiniteBinaryOperation<T>
  private allSquareElements?: FiniteSet<T>

  public constructor(set: FiniteSet<T>, operation: FiniteBinaryOperation<T>) {
    this.set = set

    // Only need to check that the set equals the codomain of the operation.
    // Domain of the operation, by construction of `FiniteBinaryOperation`, will be (codomain X codomain)
    if (!operation.codomain.isEqualTo(this.set)) {
      throw new DoesNotSatisfyPropertyError("The codomain of the new operation is not the set of the magma.")
    }

    this.operation = operation
  }

  /**
   * Returns the result of applying the operation of the structure to a Tuple (pair) of elements.
   * @param input The Tuple (pair) to apply the operation to.
   */
  public applyOperation(input: Tuple): T {
    return this.operation.applyMap(input)
  }

  /**
   * Returns the set of all elements of the structure `a` such that there exists a `b` where `a = b * b`.
   */
  public setOfSquareElements(): FiniteSet<T> {
    if (!("all square elements" in this.magmaProperties)) {
      const result = new FiniteSet<T>()
      for (let index = 0; index < this.set.cardinality(); index++) {
        const element = this.set.element(index)
        const pair = new Tuple(2, [element, element])
        result.addElement(this.applyOperation(pair))
      }

      this.allSquareElements = result
      this.magmaProperties["all square elements"] = true
    }

    return this.allSquareElements!
  }
}
