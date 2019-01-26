import { DoesNotSatisfyPropertyError } from "../../common/CommonErrors"
import { FiniteBinaryOperation } from "../../common/functions/FiniteBinaryOperation"
import { FiniteSet } from "../../common/sets/FiniteSet"
import { FiniteSemiGroup } from "./SemiGroup"

/**
 * Represents a finite monoid with elements of type T.
 */
export class FiniteMonoid<T extends IEquatable<T>> extends FiniteSemiGroup<T> {
  public readonly identity: T

  public constructor(set: FiniteSet<T>, operation: FiniteBinaryOperation<T>) {
    super(set, operation)

    if (!operation.hasIdentity()) {
      throw new DoesNotSatisfyPropertyError("The new operation does not have an identity element.")
    }

    this.identity = operation.identity!
  }
}
