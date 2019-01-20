export class RealNumber implements IEquatable<RealNumber> {
  public value: number

  public constructor(value: number = 0) {
    this.value = value
  }

  public isEqualTo(rhs: RealNumber): boolean {
    return this.value === rhs.value
  }

  public toString(): string {
    return this.value.toString()
  }
}
