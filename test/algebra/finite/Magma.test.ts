import { ZmodNAdditionMap } from "../../../src/algebra/finite/examples"
import { FiniteMagma } from "../../../src/algebra/finite/Magma"
import { FiniteBinaryOperation } from "../../../src/common/functions/FiniteBinaryOperation"
import { RealNumber } from "../../../src/common/RealNumber"
import { FiniteSet } from "../../../src/common/sets/FiniteSet"
import { Tuple } from "../../../src/common/sets/Tuple"

describe("FiniteMagma", () => {
  const Zmod2Set = new FiniteSet<RealNumber>([0, 1].map(x => new RealNumber(x)))
  const Zmod2Addition = new FiniteBinaryOperation(Zmod2Set, new ZmodNAdditionMap(new RealNumber(2)))

  test("{0, 1, 2} does not form a magma with Zmod2 addition", () => {
    const testSet = new FiniteSet<RealNumber>([0, 1, 2].map(x => new RealNumber(x)))

    expect(() => {
      new FiniteMagma(testSet, Zmod2Addition)
    }).toThrow()
  })

  test("Zmod2 is a magma", () => {
    const Zmod2Magma = new FiniteMagma(Zmod2Set, Zmod2Addition)
    expect(Zmod2Magma).toBeDefined()
  })

  describe("given Zmod2", () => {
    const Zmod2Magma = new FiniteMagma(Zmod2Set, Zmod2Addition)

    test("using the convenience `applyOperation` passes through", () => {
      const pair = new Tuple(2, [new RealNumber(1), new RealNumber(1)])

      expect(Zmod2Magma.applyOperation(pair).isEqualTo(new RealNumber(0))).toBeTruthy()
    })

    test("the set of square elements is the only the identity", () => {
      const testSet = new FiniteSet<RealNumber>([new RealNumber(0)])

      expect(Zmod2Magma.setOfSquareElements().isEqualTo(testSet))
    })
  })
})
