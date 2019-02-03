import { IComparable, IEquatable, IMultiplicativeIdentity, ISubtractable } from "../interfaces"

export class IntegerNumber
  implements
    IComparable<IntegerNumber>,
    IEquatable<IntegerNumber>,
    IMultiplicativeIdentity<IntegerNumber>,
    ISubtractable<IntegerNumber> {
  public value: number

  public constructor(value: number = 0) {
    if (!Number.isInteger(value)) {
      throw new Error("Value is not an integer.")
    }

    this.value = value
  }

  public get additiveIdentity(): IntegerNumber {
    return new IntegerNumber()
  }

  public get multiplicativeIdentity(): IntegerNumber {
    return new IntegerNumber(1)
  }

  public add(rhs: IntegerNumber): IntegerNumber {
    return new IntegerNumber(this.value + rhs.value)
  }

  public compareTo(rhs: IntegerNumber): number {
    if (this.value < rhs.value) {
      return -1
    } else if (this.value === rhs.value) {
      return 0
    }

    return 1
  }

  public isEqualTo(rhs: IntegerNumber): boolean {
    return this.value === rhs.value
  }

  public subtract(rhs: IntegerNumber): IntegerNumber {
    return new IntegerNumber(this.value - rhs.value)
  }

  public toString(): string {
    return this.value.toString()
  }
}
