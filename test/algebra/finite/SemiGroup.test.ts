import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples/ZmodNAdditionMap"
import { ZmodNMultiplicationMap } from "../../../src/algebra/finite/examples/ZmodNMultiplicationMap"
import { FiniteSemiGroup } from "../../../src/algebra/finite/SemiGroup"
import { FiniteBinaryOperation } from "../../../src/common/functions/FiniteBinaryOperation"
import { RealNumber } from "../../../src/common/RealNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"

describe("FiniteSemiGroup", () => {
  const Zmod2Set = new FiniteSet<RealNumber>([0, 1].map(x => new RealNumber(x)))
  const Zmod2Addition = new FiniteBinaryOperation(Zmod2Set, new ZmodNAdditionMap(new RealNumber(2)))

  test("Zmod2 is a semigroup", () => {
    const Zmod2SemiGroup = new FiniteSemiGroup(Zmod2Set, Zmod2Addition)
    expect(Zmod2SemiGroup).toBeDefined()
  })

  describe("given (Zmod2, +)", () => {
    const Zmod2SemiGroup = new FiniteSemiGroup(Zmod2Set, Zmod2Addition)

    test("it is not a band", () => {
      expect(Zmod2SemiGroup.isBand()).toBeFalsy()
    })

    test("it is not a semilattice", () => {
      expect(Zmod2SemiGroup.isSemilattice()).toBeFalsy()
    })
  })

  describe("given (Zmod2, *)", () => {
    const Zmod2Multiplication = new FiniteBinaryOperation(Zmod2Set, new ZmodNMultiplicationMap(new RealNumber(2)))
    const Zmod2SemiGroup = new FiniteSemiGroup(Zmod2Set, Zmod2Multiplication)

    test("it is a band", () => {
      expect(Zmod2SemiGroup.isBand()).toBeTruthy()
    })

    test("it is a semilattice", () => {
      expect(Zmod2SemiGroup.isSemilattice()).toBeTruthy()
    })
  })
})
