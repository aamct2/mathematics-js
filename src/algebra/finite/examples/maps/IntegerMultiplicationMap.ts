import { IntegerNumber } from "../../../../common/numbers/IntegerNumber"
import { Tuple } from "../../../../common/sets/Tuple"

/**
 * Multiplies two integers together.
 */
export class IntegerMultiplicationMap implements IMap<Tuple, IntegerNumber> {
  public applyMap(input: Tuple): IntegerNumber {
    if (input.elements[0].constructor === input.elements[1].constructor) {
      const lhs = input.elements[0].value
      const rhs = input.elements[1].value

      return new IntegerNumber(lhs * rhs)
    } else {
      throw new Error("The components of the input for `IntegerMultiplicationMap` are not of the same type.")
    }
  }
}
