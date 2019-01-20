import { FiniteSet } from "../sets/FiniteSet"
import { Tuple } from "../sets/Tuple"
import { FiniteFunction } from "./FiniteFunction"

export class FiniteBinaryOperation<T extends IEquatable<T>> extends FiniteFunction<Tuple, T> {
  public constructor(codomain: FiniteSet<T>, relation: IMap<Tuple, T>) {
    super(codomain.directProduct(codomain), codomain, relation)
  }
}
