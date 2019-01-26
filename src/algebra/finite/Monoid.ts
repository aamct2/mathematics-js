import { DoesNotSatisfyPropertyError } from "../../common/CommonErrors"
import { FiniteBinaryOperation } from "../../common/functions/FiniteBinaryOperation"
import { FiniteFunction } from "../../common/functions/FiniteFunction"
import { FiniteSet } from "../../common/sets/FiniteSet"
import { Tuple } from "../../common/sets/Tuple"
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

  /**
   * Determines whether a function is a homomorphism from this monoid to another monoid.
   * @param codomain The other monoid that serves as the codomain for the function.
   * @param testFunction The function to test.
   */
  public isHomomorphism<G extends IEquatable<G>>(
    codomain: FiniteMonoid<G>,
    testFunction: FiniteFunction<T, G>
  ): boolean {
    if (!testFunction.codomain.isEqualTo(codomain.set)) {
      throw new Error("The codomain of of the parameter `testFunction` is not the parameter `codomain`.")
    } else if (!testFunction.domain.isEqualTo(this.set)) {
      throw new Error("The domain of of the parameter `testFunction` is not this monoid.")
    }

    // Check that f(a + b) = f(a) * f(b)
    const domainSize = this.set.cardinality()
    for (let indexA = 0; indexA < domainSize; indexA++) {
      const elementA = this.set.element(indexA)

      for (let indexB = 0; indexB < domainSize; indexB++) {
        const elementB = this.set.element(indexB)

        const lhsTuple = new Tuple(2, [elementA, elementB])
        const lhs = testFunction.applyMap(this.applyOperation(lhsTuple))

        const rhsTuple1 = testFunction.applyMap(elementA)
        const rhsTuple2 = testFunction.applyMap(elementB)
        const rhsTuple = new Tuple(2, [rhsTuple1, rhsTuple2])
        const rhs = codomain.applyOperation(rhsTuple)

        if (!lhs.isEqualTo(rhs)) {
          return false
        }
      }
    }

    // Check that f(1) = 1'
    if (!testFunction.applyMap(this.identity).isEqualTo(codomain.identity)) {
      return false
    }

    return true
  }

  /**
   * Determines whether a function is a isomorphism from this monoid to another monoid. In other words, it's a bijective homomorphism.
   * @param codomain The other monoid that serves as the codomain for the function.
   * @param testFunction The function to test.
   */
  public isIsomorphism<G extends IEquatable<G>>(
    codomain: FiniteMonoid<G>,
    testFunction: FiniteFunction<T, G>
  ): boolean {
    if (!testFunction.codomain.isEqualTo(codomain.set)) {
      throw new Error("The codomain of of the parameter `testFunction` is not the parameter `codomain`.")
    } else if (!testFunction.domain.isEqualTo(this.set)) {
      throw new Error("The domain of of the parameter `testFunction` is not this monoid.")
    }

    if (testFunction.isBijective() && this.isHomomorphism(codomain, testFunction)) {
      return true
    }

    return false
  }
}
