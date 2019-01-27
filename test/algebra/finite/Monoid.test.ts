import { IdentityMap } from "../../../src/algebra/finite/examples/maps/IdentityMap"
import { IntegerMultiplicationMap } from "../../../src/algebra/finite/examples/maps/IntegerMultiplicationMap"
import { LeftZeroNMap } from "../../../src/algebra/finite/examples/maps/LeftZeroNMap"
import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples/maps/ZmodNAdditionMap"
import { ZmodNMultiplicationMap } from "../../../src/algebra/finite/examples/maps/ZmodNMultiplicationMap"
import { FiniteMonoid } from "../../../src/algebra/finite/Monoid"
import { FiniteSemiGroup } from "../../../src/algebra/finite/SemiGroup"
import { FiniteBinaryOperation } from "../../../src/common/functions/FiniteBinaryOperation"
import { FiniteFunction } from "../../../src/common/functions/FiniteFunction"
import { IntegerNumber } from "../../../src/common/IntegerNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"

describe("FiniteMonoid", () => {
  const Zmod2Set = new FiniteSet<IntegerNumber>([0, 1].map(x => new IntegerNumber(x)))
  const Zmod2Addition = new FiniteBinaryOperation(Zmod2Set, new ZmodNAdditionMap(new IntegerNumber(2)))

  test("(Zmod2, +) is a monoid", () => {
    const Zmod2Monoid = new FiniteMonoid(Zmod2Set, Zmod2Addition)
    expect(Zmod2Monoid).toBeDefined()
  })

  test("(Zmod2, *) is a monoid", () => {
    const Zmod2Multiplication = new FiniteBinaryOperation(Zmod2Set, new ZmodNMultiplicationMap(new IntegerNumber(2)))
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

  describe("given (Zmod2, +)", () => {
    const Zmod2Monoid = new FiniteMonoid(Zmod2Set, Zmod2Addition)

    describe("given the identity function is a homomorphism between (Zmod2, +) and itself", () => {
      const identityFunction = new FiniteFunction(Zmod2Set, Zmod2Set, new IdentityMap<IntegerNumber>())

      test("it is a homomorphism", () => {
        expect(Zmod2Monoid.isHomomorphism(Zmod2Monoid, identityFunction)).toBeTruthy()
      })

      test("it is an isomorphism", () => {
        expect(Zmod2Monoid.isIsomorphism(Zmod2Monoid, identityFunction)).toBeTruthy()
      })
    })

    test("The identity function is not a homomorphism between (Zmod2, +) and (Zmod2, *)", () => {
      const Zmod2Multiplication = new FiniteBinaryOperation(Zmod2Set, new ZmodNMultiplicationMap(new IntegerNumber(2)))
      const Zmod2MultiplicationMonoid = new FiniteMonoid(Zmod2Set, Zmod2Multiplication)

      const identityFunction = new FiniteFunction(Zmod2Set, Zmod2Set, new IdentityMap<IntegerNumber>())

      expect(Zmod2Monoid.isHomomorphism(Zmod2MultiplicationMonoid, identityFunction)).toBeFalsy()
    })

    describe("given a function between (Zmod2, +) and ({-1, 1}, *)", () => {
      class HomomorphismMap implements IMap<IntegerNumber, IntegerNumber> {
        public applyMap(input: IntegerNumber): IntegerNumber {
          if (input.value === 0) {
            return new IntegerNumber(1)
          } else {
            return new IntegerNumber(-1)
          }
        }
      }

      const secondSet = new FiniteSet<IntegerNumber>([-1, 1].map(x => new IntegerNumber(x)))
      const secondOperation = new FiniteBinaryOperation(secondSet, new IntegerMultiplicationMap())
      const secondMonoid = new FiniteMonoid(secondSet, secondOperation)
      const homomorphism = new FiniteFunction(Zmod2Set, secondSet, new HomomorphismMap())

      test("it is a homomorphism", () => {
        expect(Zmod2Monoid.isHomomorphism(secondMonoid, homomorphism)).toBeTruthy()
      })

      test("it is an isomorphism", () => {
        expect(Zmod2Monoid.isIsomorphism(secondMonoid, homomorphism)).toBeTruthy()
      })
    })

    describe("given a function between (Zmod4, +) and (Zmod2, +)", () => {
      // tslint:disable-next-line:max-classes-per-file
      class HomomorphismMap implements IMap<IntegerNumber, IntegerNumber> {
        public applyMap(input: IntegerNumber): IntegerNumber {
          if (input.value === 0 || input.value === 2) {
            return new IntegerNumber(0)
          } else {
            return new IntegerNumber(1)
          }
        }
      }

      const Zmod4Set = new FiniteSet<IntegerNumber>([0, 1, 2, 3].map(x => new IntegerNumber(x)))
      const Zmod4Addition = new FiniteBinaryOperation(Zmod4Set, new ZmodNAdditionMap(new IntegerNumber(4)))
      const Zmod4Monoid = new FiniteMonoid(Zmod4Set, Zmod4Addition)

      const homomorphism = new FiniteFunction(Zmod4Set, Zmod2Set, new HomomorphismMap())

      test("it is a homomorphism", () => {
        expect(Zmod4Monoid.isHomomorphism(Zmod2Monoid, homomorphism)).toBeTruthy()
      })

      test("it is a not an isomorphism", () => {
        expect(Zmod4Monoid.isIsomorphism(Zmod2Monoid, homomorphism)).toBeFalsy()
      })
    })

    describe("homomorphism errors", () => {
      const Zmod4Set = new FiniteSet<IntegerNumber>([0, 1, 2, 3].map(x => new IntegerNumber(x)))
      const Zmod4Addition = new FiniteBinaryOperation(Zmod4Set, new ZmodNAdditionMap(new IntegerNumber(4)))
      const Zmod4Monoid = new FiniteMonoid(Zmod4Set, Zmod4Addition)

      const identityFunctionZmod2 = new FiniteFunction(Zmod2Set, Zmod2Set, new IdentityMap<IntegerNumber>())

      test("invalid codomain", () => {
        expect(() => {
          Zmod2Monoid.isHomomorphism(Zmod4Monoid, identityFunctionZmod2)
        }).toThrow()
      })

      test("invalid domain", () => {
        expect(() => {
          Zmod4Monoid.isHomomorphism(Zmod2Monoid, identityFunctionZmod2)
        }).toThrow()
      })

      test("semigroup homomorphism that does not preserve the identity", () => {
        const Zmod1Set = new FiniteSet<IntegerNumber>([0].map(x => new IntegerNumber(x)))
        const Zmod1Addition = new FiniteBinaryOperation(Zmod1Set, new ZmodNAdditionMap(new IntegerNumber(1)))
        const Zmod1Monoid = new FiniteMonoid(Zmod1Set, Zmod1Addition)

        const Zmod2Multiplication = new FiniteBinaryOperation(
          Zmod2Set,
          new ZmodNMultiplicationMap(new IntegerNumber(2))
        )
        const Zmod2MultiplicationMonoid = new FiniteMonoid(Zmod2Set, Zmod2Multiplication)

        // tslint:disable-next-line:max-classes-per-file
        class SemigroupHomomorphismMap implements IMap<IntegerNumber, IntegerNumber> {
          public applyMap(input: IntegerNumber): IntegerNumber {
            return new IntegerNumber(0)
          }
        }

        const semigroupHomomorphism = new FiniteFunction(Zmod1Set, Zmod2Set, new SemigroupHomomorphismMap())

        expect(Zmod1Monoid.isHomomorphism(Zmod2MultiplicationMonoid, semigroupHomomorphism)).toBeFalsy()
      })
    })

    describe("isomorphism errors", () => {
      const Zmod4Set = new FiniteSet<IntegerNumber>([0, 1, 2, 3].map(x => new IntegerNumber(x)))
      const Zmod4Addition = new FiniteBinaryOperation(Zmod4Set, new ZmodNAdditionMap(new IntegerNumber(4)))
      const Zmod4Monoid = new FiniteMonoid(Zmod4Set, Zmod4Addition)

      const identityFunctionZmod2 = new FiniteFunction(Zmod2Set, Zmod2Set, new IdentityMap<IntegerNumber>())

      test("invalid codomain", () => {
        expect(() => {
          Zmod2Monoid.isIsomorphism(Zmod4Monoid, identityFunctionZmod2)
        }).toThrow()
      })

      test("invalid domain", () => {
        expect(() => {
          Zmod4Monoid.isIsomorphism(Zmod2Monoid, identityFunctionZmod2)
        }).toThrow()
      })
    })
  })
})
