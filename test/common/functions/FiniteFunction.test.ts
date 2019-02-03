import { IdentityMap, IncrementMap, LeftZeroNMap } from "../../../src/algebra/finite/examples/maps"
import { FiniteFunction, IMap } from "../../../src/common/functions"
import { IntegerNumber } from "../../../src/common/numbers"
import { FiniteSet } from "../../../src/common/sets"

describe("FiniteFunction", () => {
  describe("given Zmod2", () => {
    const Zmod2Set = new FiniteSet<IntegerNumber>([0, 1].map(x => new IntegerNumber(x)))

    test("the increment map with Zmod2 as both domain and codomain is not a function", () => {
      expect(() => {
        // tslint:disable-next-line:no-unused-expression
        new FiniteFunction(Zmod2Set, Zmod2Set, new IncrementMap<IntegerNumber>())
      }).toThrow()
    })

    test("the increment map with Zmod2 as domain and Zmod3 codomain is a function", () => {
      const Zmod3Set = new FiniteSet<IntegerNumber>([0, 1, 2].map(x => new IntegerNumber(x)))

      expect(new FiniteFunction(Zmod2Set, Zmod3Set, new IncrementMap<IntegerNumber>())).toBeDefined()
    })

    test("the identity function is not equal to the 'not' function", () => {
      const notFunction = new FiniteFunction(Zmod2Set, Zmod2Set, new NotMap())
      const identityFunction = new FiniteFunction(Zmod2Set, Zmod2Set, new IdentityMap<IntegerNumber>())

      expect(notFunction.isEqualTo(identityFunction)).toBeFalsy()
    })

    test("the identity function is not equal to the increment function, both of two elements in the domain", () => {
      const Zmod3Set = new FiniteSet<IntegerNumber>([0, 1, 2].map(x => new IntegerNumber(x)))
      const incrementFunction = new FiniteFunction(Zmod2Set, Zmod3Set, new IncrementMap<IntegerNumber>())
      const identityFunction = new FiniteFunction(Zmod2Set, Zmod2Set, new IdentityMap<IntegerNumber>())

      expect(incrementFunction.isEqualTo(identityFunction)).toBeFalsy()
    })

    describe("given the identity function", () => {
      const identityFunction = new FiniteFunction(Zmod2Set, Zmod2Set, new IdentityMap<IntegerNumber>())

      test("it is equal to itself", () => {
        expect(identityFunction.isEqualTo(identityFunction)).toBeTruthy()
      })

      test("it errors when using elements outside the domain", () => {
        expect(() => {
          identityFunction.applyMap(new IntegerNumber(3))
        }).toThrow()
      })

      test("it is injective", () => {
        expect(identityFunction.isInjective()).toBeTruthy()
      })

      test("it is surjective", () => {
        expect(identityFunction.isSurjective).toBeTruthy()
      })

      test("it is bijective", () => {
        expect(identityFunction.isBijective()).toBeTruthy()
      })
    })

    describe("given the LO_2 function", () => {
      const LO2Function = new FiniteFunction(Zmod2Set.directProduct(Zmod2Set), Zmod2Set, new LeftZeroNMap())

      test("it is not injective", () => {
        expect(LO2Function.isInjective()).toBeFalsy()
      })

      test("it is surjective", () => {
        expect(LO2Function.isSurjective()).toBeTruthy()
      })

      test("it is not bijective", () => {
        expect(LO2Function.isBijective()).toBeFalsy()
      })
    })

    describe("given the increment map with Zmod2 as domain and Zmod3 codomain", () => {
      const Zmod3Set = new FiniteSet<IntegerNumber>([0, 1, 2].map(x => new IntegerNumber(x)))
      const incrementFunction = new FiniteFunction(Zmod2Set, Zmod3Set, new IncrementMap<IntegerNumber>())

      test("it is injective", () => {
        expect(incrementFunction.isInjective()).toBeTruthy()
      })

      test("it is not surjective", () => {
        expect(incrementFunction.isSurjective()).toBeFalsy()
      })

      test("it is not bijective", () => {
        expect(incrementFunction.isBijective()).toBeFalsy()
      })
    })
  })
})

class NotMap implements IMap<IntegerNumber, IntegerNumber> {
  public applyMap(input: IntegerNumber): IntegerNumber {
    if (input.value === 0) {
      return new IntegerNumber(1)
    } else {
      return new IntegerNumber(0)
    }
  }
}
