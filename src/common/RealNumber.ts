export class RealNumber implements IComparable<RealNumber>, IEquatable<RealNumber>, ISubtractable<RealNumber> {
  public value: number

  public constructor(value: number = 0) {
    this.value = value
  }

  public add(rhs: RealNumber): RealNumber {
    return new RealNumber(this.value + rhs.value)
  }

  public get additiveIdentity(): RealNumber {
    return new RealNumber()
  }

  public compareTo(rhs: RealNumber): number {
    if (this.value < rhs.value) {
      return -1
    } else if (this.value === rhs.value) {
      return 0
    }

    return 1
  }

  public isEqualTo(rhs: RealNumber): boolean {
    return this.value === rhs.value
  }

  public subtract(rhs: RealNumber): RealNumber {
    return new RealNumber(this.value - rhs.value)
  }

  public toString(): string {
    return this.value.toString()
  }
}
