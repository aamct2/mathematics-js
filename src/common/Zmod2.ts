import { IntegerNumber } from "./IntegerNumber"

export class Zmod2 implements IEquatable<Zmod2> {
  private myValue: IntegerNumber

  public get value(): IntegerNumber {
    return this.myValue
  }

  public set value(value: IntegerNumber) {
    this.myValue.value = value.value % 2
  }

  public constructor(value: IntegerNumber = new IntegerNumber(0)) {
    this.myValue = new IntegerNumber(value.value % 2)
  }

  public isEqualTo(rhs: Zmod2): boolean {
    return this.value === rhs.value
  }
}
