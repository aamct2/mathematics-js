/**
 * Increments the value (using addition) by its multiplicative identity.
 */
export class IncrementMap<T extends IEquatable<T> & IAddable<T> & IMultiplicativeIdentity<T>> implements IMap<T, T> {
  public applyMap(input: T): T {
    return input.add(input.multiplicativeIdentity)
  }
}
