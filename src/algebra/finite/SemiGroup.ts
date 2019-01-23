import { DoesNotSatisfyPropertyError } from "../../common/CommonErrors"
import { FiniteBinaryOperation } from "../../common/functions/FiniteBinaryOperation"
import { FiniteSet } from "../../common/sets/FiniteSet"
import { FiniteMagma } from "./Magma"

enum FiniteSemiGroupPropertyKeys {
  Band = "band",
}

/**
 * Represents a finite semigroup with elements of type T.
 *
 * @template T The `type` of element in the semigroup.
 */
export class FiniteSemiGroup<T extends IEquatable<T>> extends FiniteMagma<T> {
  private semigroupProperties: { [key: string]: boolean } = {}

  public constructor(set: FiniteSet<T>, operation: FiniteBinaryOperation<T>) {
    super(set, operation)

    if (this.operation.isAssociative() === false) {
      throw new DoesNotSatisfyPropertyError("The new operation is not associative.")
    }
  }

  /**
   * Returns whether or not the semigroup is also a band (a semigroup that is idempotent).
   */
  public isBand(): boolean {
    if (!(FiniteSemiGroupPropertyKeys.Band in this.semigroupProperties)) {
      this.semigroupProperties[FiniteSemiGroupPropertyKeys.Band] = this.operation.isIdempotent()
    }

    return this.semigroupProperties[FiniteSemiGroupPropertyKeys.Band]
  }
}
