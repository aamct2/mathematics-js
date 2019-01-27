import { DoesNotSatisfyPropertyError } from "../../common/CommonErrors"
import { FiniteBinaryOperation } from "../../common/functions/FiniteBinaryOperation"
import { FiniteSet } from "../../common/sets/FiniteSet"
import { FiniteMonoid } from "./Monoid"

export class FiniteGroup<T extends IEquatable<T>> extends FiniteMonoid<T> {
  public constructor(set: FiniteSet<T>, operation: FiniteBinaryOperation<T>) {
    super(set, operation)

    if (!operation.hasInverses()) {
      throw new DoesNotSatisfyPropertyError("The new operation does not have inverses for every element.")
    }
  }

  /**
   * Returns the order of the group (i.e. the group's set's cardinality).
   */
  public get order(): number {
    return this.set.cardinality()
  }
}
