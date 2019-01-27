import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples/maps/ZmodNAdditionMap"
import { ZmodNMultiplicationMap } from "../../../src/algebra/finite/examples/ZmodNMultiplicationMap"
import { FiniteSemiGroup } from "../../../src/algebra/finite/SemiGroup"
import { FiniteBinaryOperation } from "../../../src/common/functions/FiniteBinaryOperation"
import { IntegerNumber } from "../../../src/common/IntegerNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"
import { Tuple } from "../../../src/common/sets/Tuple"

describe("FiniteSemiGroup", () => {
  const Zmod2Set = new FiniteSet<IntegerNumber>([0, 1].map(x => new IntegerNumber(x)))
  const Zmod2Addition = new FiniteBinaryOperation(Zmod2Set, new ZmodNAdditionMap(new IntegerNumber(2)))

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
    const Zmod2Multiplication = new FiniteBinaryOperation(Zmod2Set, new ZmodNMultiplicationMap(new IntegerNumber(2)))
    const Zmod2SemiGroup = new FiniteSemiGroup(Zmod2Set, Zmod2Multiplication)

    test("it is a band", () => {
      expect(Zmod2SemiGroup.isBand()).toBeTruthy()
    })

    test("it is a semilattice", () => {
      expect(Zmod2SemiGroup.isSemilattice()).toBeTruthy()
    })
  })

  test("A non-associative operation on Zmod3 does not form a semigroup", () => {
    class NonAssociativeMap implements IMap<Tuple, IntegerNumber> {
      public applyMap(input: Tuple): IntegerNumber {
        const lhs: number = input.elements[0].value
        const rhs: number = input.elements[1].value

        if (lhs === 1 && rhs === 0) {
          return new IntegerNumber(1)
        } else if ((lhs === 0 && rhs === 1) || (lhs === 2 && rhs === 2)) {
          return new IntegerNumber(2)
        } else {
          return new IntegerNumber(0)
        }
      }
    }

    const Zmod3Set = new FiniteSet<IntegerNumber>([0, 1, 2].map(x => new IntegerNumber(x)))
    const nonAssociativeOperation = new FiniteBinaryOperation(Zmod3Set, new NonAssociativeMap())

    expect(() => {
      // tslint:disable-next-line:no-unused-expression
      new FiniteSemiGroup(Zmod3Set, nonAssociativeOperation)
    }).toThrow()
  })
})
