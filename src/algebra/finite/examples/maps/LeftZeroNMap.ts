import { IntegerNumber } from "../../../../common/IntegerNumber"
import { Tuple } from "../../../../common/sets/Tuple"

export class LeftZeroNMap implements IMap<Tuple, IntegerNumber> {
  public applyMap(input: Tuple): IntegerNumber {
    if (input.elements[0].constructor === input.elements[1].constructor) {
      return input.elements[0]
    } else {
      throw new Error("The components of the input for `LeftZeroNMap` are not of the same type.")
    }
  }
}
