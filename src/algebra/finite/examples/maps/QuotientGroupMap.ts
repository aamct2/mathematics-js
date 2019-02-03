import { IMap } from "../../../../common/functions"
import { IEquatable } from "../../../../common/interfaces"
import { FiniteSet, Tuple } from "../../../../common/sets"

/**
 * The map for a quotient group.
 */
export class QuotientGroupMap<T extends IEquatable<T>> implements IMap<Tuple, FiniteSet<T>> {
  private groupMap: IMap<Tuple, T>

  constructor(groupMap: IMap<Tuple, T>) {
    this.groupMap = groupMap
  }

  public applyMap(input: Tuple): FiniteSet<T> {
    const lhs: FiniteSet<T> = input.elements[0]
    const rhs: FiniteSet<T> = input.elements[1]

    const result = new FiniteSet<T>([])

    for (let lhsIndex = 0; lhsIndex < lhs.cardinality(); lhsIndex++) {
      const lhsElement = lhs.element(lhsIndex)

      for (let rhsIndex = 0; rhsIndex < rhs.cardinality(); rhsIndex++) {
        const rhsElement = rhs.element(rhsIndex)
        const tuple = new Tuple([lhsElement, rhsElement])

        result.addElement(this.groupMap.applyMap(tuple))
      }
    }

    return result
  }
}
