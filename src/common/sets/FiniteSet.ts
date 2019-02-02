import * as _ from "lodash"
import { Tuple } from "./Tuple"

export class FiniteSet<T extends IEquatable<T>> implements IEquatable<FiniteSet<T>> {
  private elements: T[]

  public constructor(elements: T[] = []) {
    this.elements = elements
  }

  /**
   * Adds an element to this set.
   * @param element The new element to add.
   */
  public addElement(element: T) {
    for (const item of this.elements) {
      if (item.isEqualTo(element)) {
        return
      }
    }

    this.elements.push(element)
  }

  /**
   * Returns the number of elements in this set.
   */
  public cardinality(): number {
    return this.elements.length
  }

  /**
   * Creates a clone of this set.
   */
  public clone(): FiniteSet<T> {
    return _.cloneDeep(this)
  }

  /**
   * Determines whether this set contains a given element.
   * @param element The given element.
   */
  public contains(element: T): boolean {
    for (const item of this.elements) {
      if (item.isEqualTo(element)) {
        return true
      }
    }

    return false
  }

  /**
   * Deletes an elements from this set.
   * @param index Index of element to remove.
   */
  public deleteElement(index: number) {
    this.elements.splice(index, 1)
  }

  /**
   * Returns the set-theoretic difference of this set minus another set.
   * @param rhs The set whose elements are to be removed from this one.
   */
  public difference(rhs: FiniteSet<T>): FiniteSet<T> {
    const result = new FiniteSet<T>()

    for (let lhsIndex = 0; lhsIndex < this.cardinality(); lhsIndex++) {
      const lhsElement = this.element(lhsIndex)
      let found = false

      InnerLoop: for (let rhsIndex = 0; rhsIndex < rhs.cardinality(); rhsIndex++) {
        const rhsElement = rhs.element(rhsIndex)

        if (lhsElement.isEqualTo(rhsElement)) {
          found = true
          break InnerLoop
        }
      }

      if (!found) {
        result.addElement(lhsElement)
      }
    }

    return result
  }

  /**
   * Returns the direct product (also known as the cartesian product) of this set with another set.
   * @param rhs The second set.
   */
  public directProduct<G extends IEquatable<G>>(rhs: FiniteSet<G>): FiniteSet<Tuple> {
    const newSet = new FiniteSet<Tuple>([])

    // By convention, anything direct product the null set is the null set
    // For all sets A:    A x {} = {}
    if (this.isEqualTo(this.NullSet()) || rhs.isEqualTo(rhs.NullSet())) {
      return newSet.NullSet()
    }

    for (let lhsIndex = 0; lhsIndex < this.cardinality(); lhsIndex++) {
      const lhsElement = this.element(lhsIndex)

      for (let rhsIndex = 0; rhsIndex < rhs.cardinality(); rhsIndex++) {
        const rhsElement = rhs.element(rhsIndex)

        const pair = new Tuple([lhsElement, rhsElement])

        newSet.addElementWithoutCheck(pair)
      }
    }

    return newSet
  }

  /**
   * Gets an element in this set.
   * @param index Index in the set of the desired element.
   */
  public element(index: number): T {
    const indexIsValid = index <= this.elements.length - 1 && index >= 0

    if (indexIsValid) {
      return this.elements[index]
    }

    throw new RangeError("Index out of range in FiniteSet.")
  }

  /**
   * Determines whether this set is equal to a given set.
   * @param rhs The other set with which to compare.
   */
  public isEqualTo(rhs: FiniteSet<T>): boolean {
    if (this.cardinality() !== rhs.cardinality()) {
      return false
    }

    lhsLoop: for (const lhsItem of this.elements) {
      rhsLoop: for (const rhsItem of rhs.elements) {
        if (lhsItem.isEqualTo(rhsItem)) {
          continue lhsLoop
        }
      }

      return false
    }

    return true
  }

  /**
   * Returns in the index of a given element in the set.
   * @param element The index of the given element, or -1 if it is not found.
   */
  public indexOf(element: T): number {
    for (let index = 0; index < this.elements.length; index++) {
      const item = this.elements[index]

      if (item.isEqualTo(element)) {
        return index
      }
    }

    return -1
  }

  /**
   * The subset of elements which exist both in this set and another.
   * @param rhs The other set with which to intersect.
   */
  public intersection(rhs: FiniteSet<T>): FiniteSet<T> {
    // Don't waste time cranking the intersection if one of the sets is the null set
    if (this.cardinality() === 0 || rhs.cardinality() === 0) {
      return this.NullSet()
    }

    const result = new FiniteSet<T>()

    this.elements.forEach(element => {
      if (rhs.indexOf(element) > -1) {
        result.addElement(element)
      }
    })

    return result
  }

  /**
   * Determines whether this set is a subset of a given set.
   * @param rhs The potential superset.
   */
  public isSubsetOf(rhs: FiniteSet<T>): boolean {
    for (const element of this.elements) {
      if (!rhs.contains(element)) {
        return false
      }
    }

    return true
  }

  /**
   * Returns the null set (also known as the empty set).
   */
  public NullSet(): FiniteSet<T> {
    return new FiniteSet<T>()
  }

  /**
   * Returns the powerset of this set.
   */
  public PowerSet(): FiniteSet<FiniteSet<T>> {
    if (this.isEqualTo(this.NullSet())) {
      return new FiniteSet([this.NullSet()])
    }

    const result = new FiniteSet<FiniteSet<T>>()

    const baseElementSet = new FiniteSet<T>()
    baseElementSet.addElement(this.element(0))
    const differenceSet = this.difference(baseElementSet)

    return differenceSet.PowerSet().union(this.familyPlusElemenet(this.element(0), differenceSet.PowerSet()))
  }

  /**
   * Sets an element in the set.
   * @param index Index in the set for the desired element.
   * @param element The element to substitute into the set.
   */
  public setElement(index: number, element: T) {
    const indexIsValid = index <= this.elements.length - 1 && index >= 0

    if (!indexIsValid) {
      throw new RangeError("Index out of range in FiniteSet.")
    }

    const elementDoesNotExist = this.indexOf(element) !== index

    if (elementDoesNotExist) {
      this.elements[index] = element
    }
  }

  public toString(): string {
    const contents = this.elements.map(x => x.toString()).join(", ")

    return "{" + contents + "}"
  }

  /**
   * Returns the union of this set with another set.
   * @param rhs The other set with which to combine.
   */
  public union(rhs: FiniteSet<T>): FiniteSet<T> {
    // Don't waste time cranking the union if one of the sets is the null set
    if (this.isEqualTo(this.NullSet())) {
      return rhs.clone()
    } else if (rhs.isEqualTo(rhs.NullSet())) {
      return this.clone()
    }

    const result = new FiniteSet<T>()

    for (let index = 0; index < this.cardinality(); index++) {
      const element = this.element(index)

      result.addElement(element)
    }

    for (let index = 0; index < rhs.cardinality(); index++) {
      const element = rhs.element(index)

      result.addElement(element)
    }

    return result
  }

  /**
   * Add an element to this set, without checking to see if it's already in the set.
   * @param element Given element to add.
   */
  private addElementWithoutCheck(element: T) {
    this.elements.push(element)
  }

  private familyPlusElemenet(element: T, family: FiniteSet<FiniteSet<T>>): FiniteSet<FiniteSet<T>> {
    const result = new FiniteSet<FiniteSet<T>>()
    const elementSet = new FiniteSet<T>()

    elementSet.addElement(element)

    for (let index = 0; index < family.cardinality(); index++) {
      const familyElement = family.element(index)

      result.addElementWithoutCheck(familyElement.union(elementSet))
    }

    return result
  }
}
