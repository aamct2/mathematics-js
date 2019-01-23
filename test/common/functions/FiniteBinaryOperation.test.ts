import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples/ZmodNAdditionMap"
import { ZmodNMultiplicationMap } from "../../../src/algebra/finite/examples/ZmodNMultiplicationMap"
import { FiniteBinaryOperation } from "../../../src/common/functions/FiniteBinaryOperation"
import { RealNumber } from "../../../src/common/RealNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"

describe("FiniteBinaryOperation", () => {
  describe("given Zmod2", () => {
    const Zmod2Set = new FiniteSet<RealNumber>([0, 1].map(x => new RealNumber(x)))
    const Zmod2Addition = new FiniteBinaryOperation(Zmod2Set, new ZmodNAdditionMap(new RealNumber(2)))

    test("Zmod2 addition generic cayley table to be [[1, 1, 2], [2, 2, 1]]", () => {
      const cayleyTable = Zmod2Addition.cayleyTableGeneric()
      const expected: number[][] = [[1, 1, 2], [2, 2, 1]]

      expect(cayleyTable).toEqual(expected)
    })

    test("Zmod2 addition is associative", () => {
      expect(Zmod2Addition.isAssociative()).toBeTruthy()
    })

    test("Zmod2 addition is commutative", () => {
      expect(Zmod2Addition.isCommutative()).toBeTruthy()
    })

    test("Zmod2 multiplication is idempotent", () => {
      const Zmod2Multiplication = new FiniteBinaryOperation(Zmod2Set, new ZmodNMultiplicationMap(new RealNumber(2)))

      expect(Zmod2Multiplication.isIdempotent()).toBeTruthy()
    })
  })

  describe("given Zmod3", () => {
    const Zmod3Set = new FiniteSet<RealNumber>([0, 1, 2].map(x => new RealNumber(x)))
    const Zmod3Addition = new FiniteBinaryOperation(Zmod3Set, new ZmodNAdditionMap(new RealNumber(3)))

    test("Zmod3 addition is associative", () => {
      expect(Zmod3Addition.isAssociative()).toBeTruthy()
    })

    test("Zmod3 multiplication is not idempotent", () => {
      const Zmod3Multiplication = new FiniteBinaryOperation(Zmod3Set, new ZmodNMultiplicationMap(new RealNumber(3)))

      expect(Zmod3Multiplication.isIdempotent()).toBeFalsy()
    })
  })
})
