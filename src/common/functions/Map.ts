interface IMap<T extends IEquatable<T>, G extends IEquatable<G>> {
  applyMap(input: T): G
}
