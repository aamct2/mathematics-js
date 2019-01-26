import { IdentityMap } from "../../../src/algebra/finite/examples/IdentityMap"
import { IncrementMap } from "../../../src/algebra/finite/examples/IncrementMap"
import { FiniteFunction } from "../../../src/common/functions/FiniteFunction"
import { IntegerNumber } from "../../../src/common/IntegerNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"

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

    test("the identity function is equal to itself", () => {
      const identityFunction = new FiniteFunction(Zmod2Set, Zmod2Set, new IdentityMap<IntegerNumber>())

      expect(identityFunction.isEqualTo(identityFunction)).toBeTruthy()
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