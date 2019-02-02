/**
 * Represents a complex number that is usable by other Mathematics classes.
 */
export class ComplexNumber
  implements
    IComparable<ComplexNumber>,
    IEquatable<ComplexNumber>,
    ISubtractable<ComplexNumber>,
    IDivideable<ComplexNumber> {
  public readonly real: number
  public readonly imaginary: number

  constructor(real: number = 0, imaginary: number = 0) {
    this.real = real
    this.imaginary = imaginary
  }

  public get additiveIdentity(): ComplexNumber {
    return new ComplexNumber()
  }

  public get multiplicativeIdentity(): ComplexNumber {
    return new ComplexNumber(1, 0)
  }

  public absoluteValue(): ComplexNumber {
    return new ComplexNumber(Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imaginary, 2)), 0)
  }

  public add(rhs: ComplexNumber): ComplexNumber {
    return new ComplexNumber(this.real + rhs.real, this.imaginary + rhs.imaginary)
  }

  public compareTo(rhs: ComplexNumber): number {
    if (this.absoluteValue().real < rhs.absoluteValue().real) {
      return -1
    } else if (this.real === rhs.real && this.imaginary === rhs.imaginary) {
      return 0
    }

    return 1
  }

  public divide(rhs: ComplexNumber): ComplexNumber {
    if (rhs.isEqualTo(this.additiveIdentity)) {
      throw new Error("The divisor cannot be 0.")
    }

    const denominator = (Math.pow(rhs.real, 2), +Math.pow(rhs.imaginary, 2))

    return new ComplexNumber(
      (this.real * rhs.real + this.imaginary * rhs.imaginary) / denominator,
      (this.imaginary * rhs.real - this.real * rhs.imaginary) / denominator
    )
  }

  public isEqualTo(rhs: ComplexNumber): boolean {
    return this.compareTo(rhs) === 0
  }

  public multiply(rhs: ComplexNumber): ComplexNumber {
    return new ComplexNumber(
      this.real * rhs.real - this.imaginary * rhs.imaginary,
      this.imaginary * rhs.real + this.real * rhs.imaginary
    )
  }

  public subtract(rhs: ComplexNumber): ComplexNumber {
    return new ComplexNumber(this.real - rhs.real, this.imaginary - rhs.imaginary)
  }

  public toString(): string {
    if (this.imaginary < 0) {
      return `${this.real} - ${Math.abs(this.imaginary)}i`
    } else {
      return `${this.real} + ${this.imaginary}i`
    }
  }
}
