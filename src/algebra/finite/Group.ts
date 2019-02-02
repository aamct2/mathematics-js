import { DoesNotSatisfyPropertyError, NotMemberOfException } from "../../common/CommonErrors"
import { FiniteBinaryOperation } from "../../common/functions/FiniteBinaryOperation"
import { FiniteSet } from "../../common/sets/FiniteSet"
import { Tuple } from "../../common/sets/Tuple"
import { findFactors } from "../../common/util"
import { FiniteMonoid } from "./Monoid"

enum FiniteGroupPropertiesKeys {
  Abelian = "abelian",
  Cyclic = "cyclic",
  Dedekind = "dedekind",
  Metabelian = "metabelian",
  Metanilpotent = "metanilpotent",
  Nilpotent = "nilpotent",
  Solvable = "solvable",
  TStarGroup = "t*-group",
}

export class FiniteGroup<T extends IEquatable<T>> extends FiniteMonoid<T> implements IEquatable<FiniteGroup<T>> {
  /**
   * Returns the order of the group (i.e. the group's set's cardinality).
   */
  public get order(): number {
    return this.set.cardinality()
  }

  /**
   * Constructors a new `FiniteGroup` and injects into it known properties.
   * @param set The set of the new group.
   * @param operation The operation of the new group.
   * @param knownProperties The known properties of the new group.
   */
  private static KnownFiniteGroup<G extends IEquatable<G>>(
    set: FiniteSet<G>,
    operation: FiniteBinaryOperation<G>,
    knownProperties: { [key: string]: boolean }
  ): FiniteGroup<G> {
    const newGroup = new FiniteGroup(set, operation)

    newGroup.groupProperties = knownProperties

    return newGroup
  }

  private groupProperties: { [key: string]: boolean } = {}

  public constructor(set: FiniteSet<T>, operation: FiniteBinaryOperation<T>) {
    super(set, operation)

    if (!operation.hasInverses()) {
      throw new DoesNotSatisfyPropertyError("The new operation does not have inverses for every element.")
    }
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
   * Returns the center of the group as a group. (In fact, this group is always abelian.)
   */
  public centerGroup(): FiniteGroup<T> {
    const newSet = this.center()
    const newOperation = this.operation.restriction(newSet)

    const knownProperties = this.subgroupClosedProperties()
    knownProperties[FiniteGroupPropertiesKeys.Abelian] = true

    return FiniteGroup.KnownFiniteGroup(newSet, newOperation, knownProperties)
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

  /**
   * Determines whether a given element generates the group.
   * @param element The element to test as a generator of the group.
   */
  public generatesGroup(element: T): boolean {
    if (!this.set.contains(element)) {
      throw new NotMemberOfException("The parameter `element` is not a member of this group.")
    }

    if (this.orderOf(element) === this.order) {
      return true
    }

    return false
  }

  /**
   * Determines whether this group is abelian. In other words, if its operation is commutative.
   */
  public isAbelian(): boolean {
    if (!(FiniteGroupPropertiesKeys.Abelian in this.groupProperties)) {
      this.groupProperties[FiniteGroupPropertiesKeys.Abelian] = this.operation.isCommutative()
    }

    return this.groupProperties[FiniteGroupPropertiesKeys.Abelian]
  }

  /**
   * Determines whether or not this group is cyclic.
   */
  public isCyclic(): boolean {
    if (!(FiniteGroupPropertiesKeys.Cyclic in this.groupProperties)) {
      for (let index = 0; index < this.order; index++) {
        const element = this.set.element(index)

        if (this.generatesGroup(element)) {
          this.groupProperties[FiniteGroupPropertiesKeys.Cyclic] = true
          return true
        }
      }

      this.groupProperties[FiniteGroupPropertiesKeys.Cyclic] = false
      return false
    }

    return this.groupProperties[FiniteGroupPropertiesKeys.Cyclic]
  }

  /**
   * Determines if this group is equal to a given group.
   * @param rhs Other group to which to compare equality.
   */
  public isEqualTo(rhs: FiniteGroup<T>): boolean {
    return this.set.isEqualTo(rhs.set) && this.operation.isEqualTo(rhs.operation)
  }

  /**
   * Determines whether this group is a subgroup of another group.
   * @param rhs The supergroup (or ambient group) to test if this group is a subgroup of it.
   */
  public isSubgroupOf(rhs: FiniteGroup<T>): boolean {
    if (!this.set.isSubsetOf(rhs.set)) {
      return false
    }

    if (!this.operation.isEquivalentMapTo(rhs.operation.relation, rhs.operation.domain, rhs.operation.codomain)) {
      return false
    }

    // Collect any useful new inherited information since it is a subgroup.
    const subgroupProperties = rhs.subgroupClosedProperties()
    Object.entries(subgroupProperties).forEach(([key, value]) => {
      if (!(key in this.groupProperties)) {
        this.groupProperties[key] = value
      }
    })

    return true
  }

  /**
   * Returns the order of a particular element of the group.
   * @param element The element whose order is to be returned.
   */
  public orderOf(element: T): number {
    if (!this.set.contains(element)) {
      throw new NotMemberOfException(`The set does not contain ${element}`)
    }

    // Deal with the trivial case
    if (element.isEqualTo(this.identity)) {
      return 1
    }

    // The order of an element must divide the order of the group,
    //   thus we only need to check those powers.
    let currentPower = element
    const possibleOrders = findFactors(this.order)

    for (let index = 1; index < possibleOrders.length; index++) {
      const possibleOrder = possibleOrders[index]
      const secondValue = this.power(element, possibleOrder - possibleOrders[index - 1])
      const tuple = new Tuple([currentPower, secondValue])
      currentPower = this.applyOperation(tuple)

      if (currentPower.isEqualTo(this.identity)) {
        return possibleOrder
      }
    }

    throw new Error("Error: Could not find order of element?! There must be a problem with the code.")
  }

  /**
   * Returns the power of a given element.
   * @param element The element to multiply by itself to the exponent-th degree.
   * @param exponent The number of times to multiply the element by itself.
   */
  public power(element: T, exponent: number): T {
    if (!Number.isInteger(exponent) || !(exponent > 0)) {
      throw new Error("Expected exponent to be a positive integer.")
    }

    if (!this.set.contains(element)) {
      throw new NotMemberOfException("The element is not a member of the group.")
    }

    let x = this.identity
    let g = element
    let currentExponent = exponent

    if (currentExponent % 2 === 1) {
      const tuple = new Tuple([x, g])
      x = this.applyOperation(tuple)
    }

    while (currentExponent > 1) {
      const tuple = new Tuple([g, g])
      g = this.applyOperation(tuple)

      currentExponent = Math.floor(currentExponent / 2)

      if (currentExponent % 2 === 1) {
        const tuple2 = new Tuple([x, g])
        x = this.applyOperation(tuple2)
      }
    }

    return x
  }

  /**
   * Returns the trivial subgroup of this group.
   */
  public trivialSubgroup(): FiniteGroup<T> {
    const newSet = new FiniteSet<T>()
    newSet.addElement(this.identity)

    const newOperation = this.operation.restriction(newSet)

    return FiniteGroup.KnownFiniteGroup(newSet, newOperation, this.subgroupClosedProperties())
  }

  /**
   * Returns a dictionary of all the properties known about this group that are inherited by any subgroup.
   */
  private subgroupClosedProperties(): { [key: string]: boolean } {
    const result: { [key: string]: boolean } = {}

    function checkAndAddProperty(property: string, containingGroup: FiniteGroup<T>) {
      if (property in containingGroup.groupProperties) {
        if (containingGroup.groupProperties[property]) {
          result[property] = true
        }
      }
    }

    const stableProperties = [
      FiniteGroupPropertiesKeys.Abelian,
      FiniteGroupPropertiesKeys.Cyclic,
      FiniteGroupPropertiesKeys.Dedekind,
      FiniteGroupPropertiesKeys.Metabelian,
      FiniteGroupPropertiesKeys.Metanilpotent,
      FiniteGroupPropertiesKeys.Nilpotent,
      FiniteGroupPropertiesKeys.Solvable,
      FiniteGroupPropertiesKeys.TStarGroup,
    ]

    stableProperties.forEach(property => {
      checkAndAddProperty(property, this)
    })

    return result
  }
}
