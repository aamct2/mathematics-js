/**
 * Maps any given element to itself.
 */
export class IdentityMap<T extends IEquatable<T>> implements IMap<T, T> {
  public applyMap(input: T): T {
    return input
  }
}
