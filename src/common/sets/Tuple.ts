/**
 * An ordered collection of elements (not neccessarily of the same type).
 */
export class Tuple implements IEquatable<Tuple> {
  public elements: any[]

  public constructor(elements: any[] = []) {
    this.elements = elements
  }

  public get size(): number {
    return this.elements.length
  }

  public isEqualTo(rhs: Tuple): boolean {
    if (this.size !== rhs.size) {
      return false
    }

    for (let index = 0; index < this.elements.length; index++) {
      const lhsElement = this.elements[index]
      const rhsElement = rhs.elements[index]

      // Make sure the elements are of the same type
      if (!(lhsElement.constructor === rhsElement.constructor)) {
        return false
      }

      // Check if the object has an equality function
      if (!(typeof lhsElement.isEqualTo === "function")) {
        return false
      }

      // Check if the elements themselves are equal
      if (!lhsElement.isEqualTo(rhsElement)) {
        return false
      }
    }

    return true
  }

  public toString(): string {
    const contents = this.elements.map(x => x.toString()).join(", ")

    return "(" + contents + ")"
  }
}
