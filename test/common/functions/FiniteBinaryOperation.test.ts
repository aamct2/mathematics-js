import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples"
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
  })
})
