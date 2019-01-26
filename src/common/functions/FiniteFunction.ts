import { FiniteSet } from "../sets/FiniteSet"

export class FiniteFunction<T extends IEquatable<T>, G extends IEquatable<G>>
  implements IEquatable<FiniteFunction<T, G>> {
  public readonly domain: FiniteSet<T>
  public readonly codomain: FiniteSet<G>
  public readonly relation: IMap<T, G>

  protected functionProperties: { [key: string]: boolean } = {}

  public constructor(domain: FiniteSet<T>, codomain: FiniteSet<G>, relation: IMap<T, G>) {
    this.domain = domain
    this.codomain = codomain

    for (let index = 0; index < this.domain.cardinality(); index++) {
      const element = this.domain.element(index)
      const mappedElement = relation.applyMap(element)

      if (!this.codomain.contains(mappedElement)) {
        throw new Error(
          "The codomain does not contain the output element for the domain element at index " + index + "."
        )
      }
    }

    this.relation = relation
  }

  public applyMap(input: T): G {
    if (!this.domain.contains(input)) {
      throw new Error("Domain does not contain input element!")
    }

    // No need to check if the output is in the codomain.
    // The relation is checked to be well-defined when `relation` is set.

    return this.relation.applyMap(input)
  }

  public isEqualTo(rhs: FiniteFunction<T, G>): boolean {
    if (!rhs.domain.isEqualTo(this.domain) || !rhs.codomain.isEqualTo(this.codomain)) {
      return false
    }

    for (let index = 0; index < this.domain.cardinality() - 1; index++) {
      const element = this.domain.element(index)

      if (!this.applyMap(element).isEqualTo(rhs.applyMap(element))) {
        return false
      }
    }

    return true
  }
}
