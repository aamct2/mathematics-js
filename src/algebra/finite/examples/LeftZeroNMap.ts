import { RealNumber } from "../../../common/RealNumber"
import { Tuple } from "../../../common/sets/Tuple"

export class LeftZeroNMap implements IMap<Tuple, RealNumber> {
  public applyMap(input: Tuple): RealNumber {
    if (input.elements[0].constructor === input.elements[1].constructor) {
      return input.elements[0]
    } else {
      throw new Error("The components of the input for `LeftZeroNMap` are not of the same type.")
    }
  }
}
