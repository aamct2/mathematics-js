import {
  DoesNotSatisfyPropertyError,
  NotMemberOfException,
  NotSubgroupException,
  UndefinedException,
} from "../../../common/CommonErrors"
import { FiniteBinaryOperation, IMap } from "../../../common/functions"
import { IEquatable } from "../../../common/interfaces"
import { FiniteSet, Tuple } from "../../../common/sets"
import { findFactors } from "../../../common/util"
import { QuotientGroupMap } from "../examples/maps"
import { FiniteMonoid } from "./Monoid"

enum FiniteGroupPropertiesKeys {
  Abelian = "abelian",
  AllNormalSubgroups = "all normal subgroups",
  AllSubgroups = "all subgroups",
  Ambivalent = "ambivalent",
  Cyclic = "cyclic",
  Dedekind = "dedekind",
  Hamiltonian = "hamiltonian",
  Metabelian = "metabelian",
  Metanilpotent = "metanilpotent",
  Nilpotent = "nilpotent",
  Perfect = "perfect",
  Simple = "simple",
  Solvable = "solvable",
  TGroup = "t-group",
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

  /**
   * Attempts to generate a set given a set of generators and a map.
   * @param generatorSet The set of generators.
   * @param map The map to apply on the set of generators.
   */
  private static GeneratedSet<G extends IEquatable<G>>(generatorSet: FiniteSet<G>, map: IMap<Tuple, G>): FiniteSet<G> {
    let cycleIndex = 0
    const result = generatorSet.clone()

    while (cycleIndex < 3000) {
      let foundNewElement = false

      for (let firstIndex = result.cardinality() - 1; firstIndex >= 0; firstIndex--) {
        const firstElement = result.element(firstIndex)

        for (let secondIndex = result.cardinality() - 1; secondIndex >= 0; secondIndex--) {
          const secondElement = result.element(secondIndex)
          const tuple = new Tuple([firstElement, secondElement])

          try {
            const currentElement = map.applyMap(tuple)

            if (!result.contains(currentElement)) {
              result.addElement(currentElement)
              foundNewElement = true
            }
          } catch (error) {
            throw new UndefinedException(
              `Error: In GeneratedSet, the tuple ${tuple}  is not a member of the domain of the map.`
            )
          }
        }
      }

      if (!foundNewElement) {
        return result
      }

      cycleIndex++
    }

    throw new Error("Error: GeneratedSet went on an infinite loop!")
  }

  private allNormalSubgroups?: FiniteSet<FiniteGroup<T>>
  private allSubgroups?: FiniteSet<FiniteGroup<T>>
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
   * Returns the conjugacy class of an element.
   * @param element The element whose conjugacy class is to be returned.
   */
  public conjugacyClass(element: T): FiniteSet<T> {
    if (!this.set.contains(element)) {
      throw new NotMemberOfException("The parameter `element` is not a member of the group.")
    }

    const result = new FiniteSet<T>([])

    for (let index = 0; index < this.order; index++) {
      const currentElement = this.set.element(index)
      const tuple1 = new Tuple([currentElement, element])
      const tuple2 = new Tuple([this.applyOperation(tuple1), this.operation.inverseElement(currentElement)])

      result.addElement(this.applyOperation(tuple2))
    }

    return result
  }

  /**
   * Returns the derived subgroup (also known as the commutator subgroup) of this group. In other words, the group whose elements are all the possible commutators of this group.
   */
  public derivedSubgroup(): FiniteGroup<T> {
    const generatorSet = new FiniteSet<T>()
    for (let firstIndex = 0; firstIndex < this.order; firstIndex++) {
      const firstElement = this.set.element(firstIndex)

      for (let secondIndex = 0; secondIndex < this.order; secondIndex++) {
        const secondElement = this.set.element(secondIndex)

        generatorSet.addElement(this.commutator(firstElement, secondElement))
      }
    }

    try {
      const set = FiniteGroup.GeneratedSet(generatorSet, this.operation.relation)

      if (!set.contains(this.identity)) {
        throw new Error(
          "FiniteGroup.GeneratedSet created a set using the commutators of the group, but it does not include the identity element. This should not be possible."
        )
      }

      const operation = this.operation.restriction(set)

      return FiniteGroup.KnownFiniteGroup(set, operation, this.subgroupClosedProperties())
    } catch (error) {
      throw new Error("derivedSubgroup() is unable to generate a set based on the set of commutators.")
    }
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
   * Determines whether or not this group is a Dedekind group. In other words, that all its subgroups are normal.
   */
  public isDedekind(): boolean {
    if (!(FiniteGroupPropertiesKeys.Dedekind in this.groupProperties)) {
      function checkProperty(property: FiniteGroupPropertiesKeys, containingGroup: FiniteGroup<T>): boolean {
        if (property in containingGroup.groupProperties) {
          return containingGroup.groupProperties[property]
        }

        return false
      }

      // Abelian implies Dedekind, check to see if we've calculated that already.
      if (checkProperty(FiniteGroupPropertiesKeys.Abelian, this)) {
        this.groupProperties[FiniteGroupPropertiesKeys.Dedekind] = true
        return true
      }

      // Nilpotent + T-Group implies Dedekind, check to see if we've calculated that already.
      if (
        checkProperty(FiniteGroupPropertiesKeys.Nilpotent, this) &&
        checkProperty(FiniteGroupPropertiesKeys.TGroup, this)
      ) {
        this.groupProperties[FiniteGroupPropertiesKeys.Dedekind] = true
        return true
      }

      const result = this.setOfAllSubgroups().isEqualTo(this.setOfAllNormalSubgroups())
      this.groupProperties[FiniteGroupPropertiesKeys.Dedekind] = result
    }

    return this.groupProperties[FiniteGroupPropertiesKeys.Dedekind]
  }

  /**
   * Determines if this group is equal to a given group.
   * @param rhs Other group to which to compare equality.
   */
  public isEqualTo(rhs: FiniteGroup<T>): boolean {
    return this.set.isEqualTo(rhs.set) && this.operation.isEqualTo(rhs.operation)
  }

  /**
   * Determines whether or not this group is a Hamiltonian group. In other words, a non-abelian Dedekind group.
   */
  public isHamiltonian(): boolean {
    if (!(FiniteGroupPropertiesKeys.Hamiltonian in this.groupProperties)) {
      let result: boolean = false

      if (this.isDedekind() && !this.isAbelian()) {
        result = true
      }

      this.groupProperties[FiniteGroupPropertiesKeys.Hamiltonian] = result
    }

    return this.groupProperties[FiniteGroupPropertiesKeys.Hamiltonian]
  }

  /**
   * Determines whether this group is a normal subgroup of another group.
   * @param supergroup The supergroup (or ambient group) to test if this group is a normal subgroup of it.
   */
  public isNormalSubgroupOf(supergroup: FiniteGroup<T>): boolean {
    if (!this.isSubgroupOf(supergroup)) {
      return false
    }

    // Check to see if it is the whole group or the trivial group, which are trivialy normal
    if (this.order === supergroup.order || this.order === 1) {
      return true
    }

    // Check to see if it is of index 2, which would quickly imply that it is normal
    if (this.subgroupIndex(supergroup) === 2) {
      return true
    }

    // Alright, crank it the long way
    const numberOfElements = supergroup.order
    for (let index = 0; index < numberOfElements; index++) {
      const element = supergroup.set.element(index)
      const leftCoset = supergroup.leftCoset(this, element)
      const rightCoset = supergroup.rightCoset(this, element)

      if (!leftCoset.isEqualTo(rightCoset)) {
        return false
      }
    }

    return true
  }

  /**
   * Determines whether this group is perfect. In other words, it is equal to its derived subgroup.
   */
  public isPerfect(): boolean {
    if (!(FiniteGroupPropertiesKeys.Perfect in this.groupProperties)) {
      let result = false

      if (this.isEqualTo(this.derivedSubgroup())) {
        result = true
      }

      this.groupProperties[FiniteGroupPropertiesKeys.Perfect] = result
    }

    return this.groupProperties[FiniteGroupPropertiesKeys.Perfect]
  }

  /**
   * Determines whether this group is simple. In other words, if this group's only normal subgroups is the group itself and the trivial subgroup.
   */
  public isSimple(): boolean {
    if (!(FiniteGroupPropertiesKeys.Simple in this.groupProperties)) {
      let result = false

      // Check to make sure the group's only normal subgroups are itself and the trivial subgroup
      // And check to make sure it is not the trivial group itself
      if (this.setOfAllNormalSubgroups().cardinality() <= 2 && this.order > 1) {
        result = true
      }

      this.groupProperties[FiniteGroupPropertiesKeys.Simple] = result
    }

    return this.groupProperties[FiniteGroupPropertiesKeys.Simple]
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
   * Returns the left coset of a particular element with a particular subgroup.
   * @param subgroup The subgroup with which to form the left coset.
   * @param element The element whose left coset is to be returned.
   */
  public leftCoset(subgroup: FiniteGroup<T>, element: T): FiniteSet<T> {
    if (!subgroup.isSubgroupOf(this)) {
      throw new NotSubgroupException("The parameter `subgroup` is not a subgroup of this group.")
    } else if (!this.set.contains(element)) {
      throw new NotMemberOfException("The parameter `element` is not an element of this group.")
    }

    const result = new FiniteSet<T>([])

    const numberOfElements = subgroup.order
    for (let index = 0; index < numberOfElements; index++) {
      const subgroupElement = subgroup.set.element(index)
      const tuple = new Tuple([element, subgroupElement])

      result.addElement(this.applyOperation(tuple))
    }

    return result
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
   * Returns the quotient group formed from this group modulo a normal subgroup.
   * @param noramlSubgroup The normal subgroup which is to be used as the divisor in the quotient construction
   */
  public quotientGroup(noramlSubgroup: FiniteGroup<T>): FiniteGroup<FiniteSet<T>> {
    if (!noramlSubgroup.isNormalSubgroupOf(this)) {
      throw new NotSubgroupException("The parameter `normalSubgroup` is not a normal subgroup of this group.")
    }

    const set = new FiniteSet<FiniteSet<T>>([])

    for (let index = 0; index < this.order; index++) {
      const element = this.set.element(index)

      set.addElement(this.leftCoset(noramlSubgroup, element))
    }

    const map = new QuotientGroupMap(this.operation.relation)
    const operation = new FiniteBinaryOperation(set, map)

    return FiniteGroup.KnownFiniteGroup(set, operation, this.quotientClosedProperties())
  }

  /**
   * Returns the right coset of a particular element with a particular subgroup.
   * @param subgroup The subgroup with which to form the right coset.
   * @param element The element whose right coset is to be returned.
   */
  public rightCoset(subgroup: FiniteGroup<T>, element: T): FiniteSet<T> {
    if (!subgroup.isSubgroupOf(this)) {
      throw new NotSubgroupException("The parameter `subgroup` is not a subgroup of this group.")
    } else if (!this.set.contains(element)) {
      throw new NotMemberOfException("The parameter `element` is not an element of this group.")
    }

    const result = new FiniteSet<T>([])

    const numberOfElements = subgroup.order
    for (let index = 0; index < numberOfElements; index++) {
      const subgroupElement = subgroup.set.element(index)
      const tuple = new Tuple([subgroupElement, element])

      result.addElement(this.applyOperation(tuple))
    }

    return result
  }

  /**
   * Returns the set of all conjugacy classes of this group.
   */
  public setOfAllConjugacyClasses(): FiniteSet<FiniteSet<T>> {
    const result = new FiniteSet<FiniteSet<T>>([])

    for (let index = 0; index < this.order; index++) {
      const element = this.set.element(index)

      result.addElement(this.conjugacyClass(element))
    }

    return result
  }

  /**
   * Returns the set of all normal subgroups of this group (includes improper subgroups).
   */
  public setOfAllNormalSubgroups(): FiniteSet<FiniteGroup<T>> {
    if (!(FiniteGroupPropertiesKeys.AllNormalSubgroups in this.groupProperties)) {
      const allSubgroups = this.setOfAllSubgroups()

      // Check to see if it is an abelian group, makes this trivial
      if (
        FiniteGroupPropertiesKeys.Abelian in this.groupProperties &&
        this.groupProperties[FiniteGroupPropertiesKeys.Abelian] === true
      ) {
        this.allNormalSubgroups = allSubgroups
        this.groupProperties[FiniteGroupPropertiesKeys.AllNormalSubgroups] = true
        return this.allNormalSubgroups!.clone()
      }

      const result = new FiniteSet<FiniteGroup<T>>()

      const numberOfSubgroups = allSubgroups.cardinality()
      for (let index = 0; index < numberOfSubgroups; index++) {
        const subgroup = allSubgroups.element(index)

        if (subgroup.isNormalSubgroupOf(this)) {
          result.addElement(subgroup)
        }
      }

      this.allNormalSubgroups = result
      this.groupProperties[FiniteGroupPropertiesKeys.AllNormalSubgroups] = true
    }

    return this.allNormalSubgroups!.clone()
  }

  /**
   * Returns the set of all subgroups of this group (includes improper subgroups).
   */
  public setOfAllSubgroups(): FiniteSet<FiniteGroup<T>> {
    if (!(FiniteGroupPropertiesKeys.AllSubgroups in this.groupProperties)) {
      const result = new FiniteSet<FiniteGroup<T>>()
      const subgroupProperties = this.subgroupClosedProperties()

      const modifiedSet = this.set.clone()
      modifiedSet.deleteElement(modifiedSet.indexOf(this.identity))

      // Generating the powerset is an expensive operation.
      // All subgroups must contain the identity element.
      // So remove it, then create the powerset, then add it back in to each of these candidates.
      const powerSet = modifiedSet.PowerSet()
      for (let index = 0; index < powerSet.cardinality(); index++) {
        const element = powerSet.element(index)
        element.addElement(this.identity)
        powerSet.setElement(index, element)
      }

      // Order of the subgroup must divide the order of the group (finite only)
      // So only bother trying those
      for (let index = powerSet.cardinality() - 1; index >= 0; index--) {
        const element = powerSet.element(index)

        if (this.order % element.cardinality() !== 0) {
          powerSet.deleteElement(index)
        }
      }

      for (let index = 0; index < powerSet.cardinality(); index++) {
        const subgroupSet = powerSet.element(index)

        try {
          const subgroupOperation = this.operation.restriction(subgroupSet)
          const subgroup = FiniteGroup.KnownFiniteGroup(subgroupSet, subgroupOperation, subgroupProperties)

          result.addElement(subgroup)
        } catch (error) {
          // If there was an exception, the operation does not exist,
          //   so that element of the power set is not a group
        }
      }

      this.allSubgroups = result
      this.groupProperties[FiniteGroupPropertiesKeys.AllSubgroups] = true
    }

    return this.allSubgroups!.clone()
  }

  /**
   * Returns the index of this group as a subgroup of a given supergroup.
   * @param supergroup The supergroup with respect to which the index is to be returned.
   */
  public subgroupIndex(supergroup: FiniteGroup<T>): number {
    if (!this.isSubgroupOf(supergroup)) {
      throw new NotSubgroupException("This group is not a subgroup of the parameter `superGroup`.")
    }

    return supergroup.order / this.order
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
   * Returns a dictionary of all the properties known about this group that are inherited by any quotient group.
   */
  private quotientClosedProperties(): { [key: string]: boolean } {
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
      FiniteGroupPropertiesKeys.Ambivalent,
      FiniteGroupPropertiesKeys.Cyclic,
      FiniteGroupPropertiesKeys.Dedekind,
      FiniteGroupPropertiesKeys.Metabelian,
      FiniteGroupPropertiesKeys.Metanilpotent,
      FiniteGroupPropertiesKeys.Nilpotent,
      FiniteGroupPropertiesKeys.Perfect,
      FiniteGroupPropertiesKeys.Solvable,
      FiniteGroupPropertiesKeys.TGroup,
    ]

    stableProperties.forEach(property => {
      checkAndAddProperty(property, this)
    })

    return result
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
