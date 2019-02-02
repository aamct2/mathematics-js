interface IComparable<T> {
  /**
   * Compares the object against another given object. If less than zero, then the current object precedes the other. If equal to zero, they have the same sort order. If greater than zero, the current object follows the other.
   * @param rhs The given object against which to compare.
   */
  compareTo(rhs: T): number
}
