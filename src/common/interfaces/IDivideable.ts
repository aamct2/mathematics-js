import { IMultipliable } from "./IMultipliable"
import { IMultiplicativeIdentity } from "./IMultiplicativeIdentity"

/**
 * Defines methods for dividing two elements as well as multiplying them and retrieving the multiplicative identity.
 */
export interface IDivideable<T> extends IMultipliable<T>, IMultiplicativeIdentity<T> {
  divide(rhs: T): T
}
