import { LeftZeroNMap } from "../../../src/algebra/finite/examples/LeftZeroNMap"
import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples/ZmodNAdditionMap"
import { ZmodNMultiplicationMap } from "../../../src/algebra/finite/examples/ZmodNMultiplicationMap"
import { FiniteMonoid } from "../../../src/algebra/finite/Monoid"
import { FiniteSemiGroup } from "../../../src/algebra/finite/SemiGroup"
import { FiniteBinaryOperation } from "../../../src/common/functions/FiniteBinaryOperation"
import { RealNumber } from "../../../src/common/RealNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"

describe("FiniteMonoid", () => {
  const Zmod2Set = new FiniteSet<RealNumber>([0, 1].map(x => new RealNumber(x)))
  const Zmod2Addition = new FiniteBinaryOperation(Zmod2Set, new ZmodNAdditionMap(new RealNumber(2)))

  test("(Zmod2, +) is a monoid", () => {
    const Zmod2Monoid = new FiniteMonoid(Zmod2Set, Zmod2Addition)
    expect(Zmod2Monoid).toBeDefined()
  })

  test("(Zmod2, *) is a monoid", () => {
    const Zmod2Multiplication = new FiniteBinaryOperation(Zmod2Set, new ZmodNMultiplicationMap(new RealNumber(2)))
    const Zmod2Monoid = new FiniteMonoid(Zmod2Set, Zmod2Multiplication)
    expect(Zmod2Monoid).toBeDefined()
  })

  test("The left zero semigroup LO_2 is a semigroup but not a monoid", () => {
    const leftZeroOperation = new FiniteBinaryOperation(Zmod2Set, new LeftZeroNMap())

    expect(new FiniteSemiGroup(Zmod2Set, leftZeroOperation)).toBeDefined()
    expect(() => {
      // tslint:disable-next-line:no-unused-expression
      new FiniteMonoid(Zmod2Set, leftZeroOperation)
    }).toThrow()
  })
})
