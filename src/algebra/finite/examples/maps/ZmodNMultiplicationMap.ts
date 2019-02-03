import { IMap } from "../../../../common/functions"
import { IntegerNumber } from "../../../../common/numbers"
import { Tuple } from "../../../../common/sets"

export class ZmodNMultiplicationMap implements IMap<Tuple, IntegerNumber> {
  public readonly dimension: IntegerNumber

  public constructor(dimension: IntegerNumber) {
    this.dimension = dimension
  }

  public applyMap(input: Tuple): IntegerNumber {
    if (
      input.elements[0].constructor === this.dimension.constructor &&
      input.elements[1].constructor === this.dimension.constructor
    ) {
      return new IntegerNumber((input.elements[0].value * input.elements[1].value) % this.dimension.value)
    } else {
      throw new Error(
        "The input for the `ZmodNMultiplicationMap` contained an element that was not an `IntegerNumber`."
      )
    }
  }
}
