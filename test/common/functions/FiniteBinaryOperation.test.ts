import { LeftZeroNMap } from "../../../src/algebra/finite/examples/LeftZeroNMap"
import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples/ZmodNAdditionMap"
import { ZmodNMultiplicationMap } from "../../../src/algebra/finite/examples/ZmodNMultiplicationMap"
import { FiniteBinaryOperation } from "../../../src/common/functions/FiniteBinaryOperation"
import { IntegerNumber } from "../../../src/common/IntegerNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"

describe("FiniteBinaryOperation", () => {
  describe("given Zmod2", () => {
    const Zmod2Set = new FiniteSet<IntegerNumber>([0, 1].map(x => new IntegerNumber(x)))

    describe("given Zmod2 addition", () => {
      const Zmod2Addition = new FiniteBinaryOperation(Zmod2Set, new ZmodNAdditionMap(new IntegerNumber(2)))

      test("it's generic cayley table to be [[1, 1, 2], [2, 2, 1]]", () => {
        const cayleyTable = Zmod2Addition.cayleyTableGeneric()
        const expected: number[][] = [[1, 1, 2], [2, 2, 1]]

        expect(cayleyTable).toEqual(expected)
      })

      test("it is associative", () => {
        expect(Zmod2Addition.isAssociative()).toBeTruthy()
      })

      test("it has an identity element", () => {
        expect(Zmod2Addition.hasIdentity()).toBeTruthy()
      })

      test("it's identity element is 0", () => {
        const identity = Zmod2Addition.identity
        expect(identity).toBeDefined()
        expect(identity!.value).toBe(0)
      })

      test("it is commutative", () => {
        expect(Zmod2Addition.isCommutative()).toBeTruthy()
      })
    })

    describe("given Zmod2 multiplication", () => {
      const Zmod2Multiplication = new FiniteBinaryOperation(Zmod2Set, new ZmodNMultiplicationMap(new IntegerNumber(2)))

      test("it has an identity element", () => {
        expect(Zmod2Multiplication.hasIdentity()).toBeTruthy()
      })

      test("it's identity element is 1", () => {
        const identity = Zmod2Multiplication.identity
        expect(identity).toBeDefined()
        expect(identity!.value).toBe(1)
      })

      test("it is idempotent", () => {
        expect(Zmod2Multiplication.isIdempotent()).toBeTruthy()
      })
    })

    describe("given the left zero semigroup LO_2", () => {
      test("it does not have an identity", () => {
        const leftZeroOperation = new FiniteBinaryOperation(Zmod2Set, new LeftZeroNMap())

        expect(leftZeroOperation.hasIdentity()).toBeFalsy()
      })
    })
  })

  describe("given Zmod3", () => {
    const Zmod3Set = new FiniteSet<IntegerNumber>([0, 1, 2].map(x => new IntegerNumber(x)))

    describe("given Zmod3 addition", () => {
      const Zmod3Addition = new FiniteBinaryOperation(Zmod3Set, new ZmodNAdditionMap(new IntegerNumber(3)))

      test("Zmod3 addition is associative", () => {
        expect(Zmod3Addition.isAssociative()).toBeTruthy()
      })
    })

    describe("given Zmod3 multiplication", () => {
      const Zmod3Multiplication = new FiniteBinaryOperation(Zmod3Set, new ZmodNMultiplicationMap(new IntegerNumber(3)))

      test("Zmod3 multiplication is not idempotent", () => {
        expect(Zmod3Multiplication.isIdempotent()).toBeFalsy()
      })
    })
  })
})
