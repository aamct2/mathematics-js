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

  public indexOf(element: T): number {
    for (let index = 0; index < this.elements.length; index++) {
      const item = this.elements[index]

      if (item.isEqualTo(element)) {
        return index
      }
    }

    return -1
  }

  public NullSet(): FiniteSet<T> {
    return new FiniteSet<T>()
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
   * Add an element to this set, without checking to see if it's already in the set.
   * @param element Given element to add.
   */
  private addElementWithoutCheck(element: T) {
    this.elements.push(element)
  }
}
