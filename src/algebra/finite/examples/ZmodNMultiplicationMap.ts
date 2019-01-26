import { RealNumber } from "../../../common/RealNumber"
import { Tuple } from "../../../common/sets/Tuple"

export class ZmodNMultiplicationMap implements IMap<Tuple, RealNumber> {
  public readonly dimension: RealNumber

  public constructor(dimension: RealNumber) {
    this.dimension = dimension
  }

  public applyMap(input: Tuple): RealNumber {
    if (
      input.elements[0].constructor === this.dimension.constructor &&
      input.elements[1].constructor === this.dimension.constructor
    ) {
      return new RealNumber((input.elements[0].value * input.elements[1].value) % this.dimension.value)
    } else {
      throw new Error(
        "The input for the `ZmodNMultiplicationMap` contained an element that was not an `IntegerNumber`."
      )
    }
  }
}