import { FiniteSet } from "../../common/sets/FiniteSet"

export class FiniteMagma<T extends IEquatable<T>> {
  private set: FiniteSet<T>

  public constructor(set: FiniteSet<T>) {
    this.set = set
  }
}
