/**
 * Defines methods for subtracting two elements as well as adding them and retrieving the additive identity.
 */
interface ISubtractable<T> extends IAddable<T>, IAdditiveIdentity<T> {
  subtract(rhs: T): T
}
