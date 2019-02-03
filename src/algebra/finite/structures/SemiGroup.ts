import { DoesNotSatisfyPropertyError } from "../../../common/CommonErrors"
import { FiniteBinaryOperation } from "../../../common/functions"
import { IEquatable } from "../../../common/interfaces"
import { FiniteSet } from "../../../common/sets"
import { FiniteMagma } from "./Magma"

enum FiniteSemiGroupPropertyKeys {
  Band = "band",
  Semilattice = "semilattice",
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

  /**
   * Returns whether or not the semigroup is also a semilattice (a semigroup that is both a band and commutative).
   */
  public isSemilattice(): boolean {
    if (!(FiniteSemiGroupPropertyKeys.Semilattice in this.semigroupProperties)) {
      this.semigroupProperties[FiniteSemiGroupPropertyKeys.Semilattice] =
        this.isBand() && this.operation.isCommutative()
    }

    return this.semigroupProperties[FiniteSemiGroupPropertyKeys.Semilattice]
  }
}
