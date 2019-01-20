import { RealNumber } from "./RealNumber"

export class Zmod2 implements IEquatable<Zmod2> {
  private myValue: RealNumber

  public get value(): RealNumber {
    return this.myValue
  }

  public set value(value: RealNumber) {
    this.myValue.value = value.value % 2
  }

  public constructor(value: RealNumber = new RealNumber(0)) {
    this.myValue = new RealNumber(value.value % 2)
  }

  public isEqualTo(rhs: Zmod2): boolean {
    return this.value === rhs.value
  }
}
