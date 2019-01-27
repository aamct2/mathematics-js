import { DoesNotSatisfyPropertyError, NotMemberOfException } from "../../common/CommonErrors"
import { FiniteBinaryOperation } from "../../common/functions/FiniteBinaryOperation"
import { FiniteSet } from "../../common/sets/FiniteSet"
import { Tuple } from "../../common/sets/Tuple"
import { FiniteMonoid } from "./Monoid"

enum FiniteGroupPropertiesKeys {
  Abelian = "abelian",
}

export class FiniteGroup<T extends IEquatable<T>> extends FiniteMonoid<T> {
  private groupProperties: { [key: string]: boolean } = {}

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

  /**
   * Returns the center of the group as a set. In other words, the set of all elements that commute with every other element in the group.
   */
  public center(): FiniteSet<T> {
    const result = new FiniteSet<T>()

    for (let candidateIndex = 0; candidateIndex < this.order; candidateIndex++) {
      const candidateElement = this.set.element(candidateIndex)
      let inCenter = true

      InnerLoop: for (let testIndex = 0; testIndex < this.order; testIndex++) {
        const testElement = this.set.element(testIndex)

        if (!this.commutator(candidateElement, testElement).isEqualTo(this.identity)) {
          inCenter = false
          break InnerLoop
        }
      }

      if (inCenter) {
        result.addElement(candidateElement)
      }
    }

    return result
  }

  /**
   * Returns the centralizer (as a subset) of a subset of a group. `C_G(S) = {g \in G | sg = gs \forall s \in S}`
   * @param subset
   */
  public centralizer(subset: FiniteSet<T>): FiniteSet<T> {
    if (!subset.isSubsetOf(this.set)) {
      throw new Error("The `subset` variable is not actually a subset of the group.")
    }

    const setOfCentralizers = new FiniteSet<FiniteSet<T>>()

    for (let subsetIndex = 0; subsetIndex < subset.cardinality(); subsetIndex++) {
      const subsetElement = subset.element(subsetIndex)
      const currentCentralizer = this.centralizerOfElement(subsetElement)

      if (currentCentralizer.cardinality() > 0) {
        setOfCentralizers.addElement(currentCentralizer)
      }
    }

    if (setOfCentralizers.cardinality() > 0) {
      let result = setOfCentralizers.element(0)

      for (let index = 1; index < setOfCentralizers.cardinality(); index++) {
        const nextSet = setOfCentralizers.element(index)

        result = result.intersection(nextSet)
      }

      return result
    }

    return this.set.NullSet()
  }

  /**
   * Returns the centralizer, with respect to this group, of a given element of the group.
   * @param element The element whose centralizer, with respect to this group, we are to form.
   */
  public centralizerOfElement(element: T): FiniteSet<T> {
    if (!this.set.contains(element)) {
      throw new NotMemberOfException("The parameter `element` is not a member of the group.")
    }

    const result = new FiniteSet<T>()
    for (let index = 0; index < this.order; index++) {
      const testElement = this.set.element(index)

      if (this.commutator(element, testElement).isEqualTo(this.identity)) {
        result.addElement(testElement)
      }
    }

    return result
  }

  /**
   * Returns the commutator of two elements, in a sense given an indication of how badly the operation fails to commute for two elements. `[g,h] = g^-1 + h^-1 + g + h`.
   * @param lhs The first element.
   * @param rhs The second element.
   */
  public commutator(lhs: T, rhs: T): T {
    if (!this.set.contains(lhs) || !this.set.contains(rhs)) {
      throw new NotMemberOfException("The parameter `lhs` or `rhs` is not a member of the group.")
    }

    const tuple1 = new Tuple([this.operation.inverseElement(lhs), this.operation.inverseElement(rhs)])
    const tuple2 = new Tuple([this.applyOperation(tuple1), lhs])
    const tuple3 = new Tuple([this.applyOperation(tuple2), rhs])

    return this.applyOperation(tuple3)
  }

  public isAbelian(): boolean {
    if (!(FiniteGroupPropertiesKeys.Abelian in this.groupProperties)) {
      this.groupProperties[FiniteGroupPropertiesKeys.Abelian] = this.operation.isCommutative()
    }

    return this.groupProperties[FiniteGroupPropertiesKeys.Abelian]
  }
}